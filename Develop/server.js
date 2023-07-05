const inquirer = require('inquirer');
const mysql = require('mysql2');
const logo = require('asciiart-logo');

console.log(
  logo({
    name: 'Employee Tracker',
    font: 'Speed',
    lineChars: 10,
    padding: 2,
    margin: 3,
    borderColor: 'white',
    logoColor: 'bold-yellow',
    textColor: 'yellow',
  }).render()
);

const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: 'abcd1234',
    database: 'company_db',
  },
  console.log(`Connected to the courses_db database.`)
);

const questions = [
  {
    type: 'list',
    name: 'initialQuestion',
    choices: [
      'View All Employees',
      'Add Employee',
      'Update Employee role',
      'View All Roles',
      'Add Role',
      'View All departments',
      'Add Department',
      'Update Manager',
      'Quit',
    ],
  },
];

const addDepartmentQuestions = [
  {
    type: 'text',
    name: 'newDepartment',
    message: 'What is the name of the new department?',
  },
];

const viewAllEmployees = () => {
  //console.log('This is the viewAllEmployees() funciton');
  const concatenatedName = 'CONCAT(first_name, " ", second_name)';
  db.query(
    `SELECT e.id AS employeeID, e.first_name AS FirstName, e.second_name AS secondName, r.title as Title, d.name as Department, IF(e.manager_id = m.id, CONCAT(m.first_name, ' ', m.second_name), NULL) AS manager_name FROM employee e LEFT JOIN employee m ON e.manager_id = m.id JOIN rol r ON e.role_id = r.id JOIN department d ON r.department_id = d.id;`,
    function (err, results, fields) {
      if (err) {
        console.log(err);
      }
      console.table(results);
      initFunction();
    }
  );
};

const addEmployee = () => {
  db.query(
    'SELECT CONCAT(first_name, " ", second_name) AS full_name FROM employee',
    function (err, results, fields) {
      const managerName = results.map((row) => row.full_name);
      //console.log('MANAGERS NAME', managerName);

      db.query('SELECT title from rol', function (err, results, fields) {
        const roleTitles = results.map((row) => row.title);

        //console.log('TITLES', roleTitles);

        const addEmployeeQuestions = [
          {
            type: 'text',
            name: 'firstName',
            message: 'What is the first name of the employee',
          },
          {
            type: 'text',
            name: 'secondName',
            message: 'What is the second name of the employee',
          },
          {
            type: 'list',
            name: 'roleTitle',
            message: 'What is the rol of the employee',
            choices: roleTitles,
          },
          {
            type: 'list',
            name: 'managerName',
            message: 'Select the manager name of the employee',
            choices: managerName,
          },
        ];
        inquirer.prompt(addEmployeeQuestions).then((answ) => {
          const employeeInfo = [];
          const employeeFirst = answ.firstName;
          const employeeSecond = answ.secondName;
          const employeeRoleTitle = answ.roleTitle;
          const employeeMangerName = answ.managerName;
          db.query(
            'SELECT id FROM rol WHERE title = ?',
            employeeRoleTitle,
            function (err, results, fields) {
              const roleID = results.map((row) => row.id);
              //console.log("ROLE'S ID", roleID);
              //console.log("ROLE'S ID 0", roleID[0]);

              const employeeRoleID = roleID[0];

              const concatenatedName = 'CONCAT(first_name, " ", second_name)';
              db.query(
                `SELECT id FROM employee WHERE ${concatenatedName} = ?`,
                employeeMangerName,
                function (err, results, fields) {
                  const managerID = results.map((row) => row.id);
                  console.log('MANAGERS ID', managerID);
                  console.log('MANAGERS ID[0]', managerID[0]);
                  const employeesManagerId = managerID[0];
                  employeeInfo.push(
                    employeeFirst,
                    employeeSecond,
                    employeeRoleID,
                    employeesManagerId
                  );

                  //console.log("EMPLOYEE'S ULTIMATE INFO", employeeInfo);
                  const sql = `INSERT INTO employee(first_Name, second_Name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
                  //console.log('EMPLOYEE INFORMATION', employeeInfo);
                  db.query(sql, employeeInfo, function (err, results, fields) {
                    console.log(
                      `Added ${employeeFirst} ${employeeSecond} to the database`
                    );
                    //console.table(results);
                    initFunction();
                  });
                }
              );
            }
          );
        });
      });
    }
  );

  // const employeeInfo = [];
  // console.log('This is the addEmployee() funciton');
};

const updateEmployeeRole = () => {
  const employeeInfo = [];
  //console.log('This is the updateEmployeeRole(); funciton');

  db.query(
    'SELECT CONCAT(first_name, " ", second_name) AS full_name FROM employee',
    function (err, results, fields) {
      //console.log('RESULT', results);
      const namesArray = results.map((row) => row.full_name);
      //console.log('NAMES', namesArray);

      db.query('SELECT title FROM rol', function (err, results, fields) {
        const rolNamesArray = results.map((row) => row.title);
        //console.log('ROL NAMES ARRAY', rolNamesArray);

        const updateEmployeeQuestions = [
          {
            type: 'list',
            name: 'selectedEmployee',
            message: "Which employee's role would yo want to update?",
            choices: namesArray,
          },
          {
            type: 'list',
            name: 'role',
            message:
              'Which role do you want to assign to the selected employee?',
            choices: rolNamesArray,
          },
        ];

        inquirer.prompt(updateEmployeeQuestions).then((answ) => {
          const employeeName = answ.selectedEmployee;
          // employeeInfo.push(employeeRoleId, employeeMangerId);
          const rolName = answ.role;
          let employeeRoleId = 0;

          db.query(
            `SELECT id FROM rol WHERE title = ?`,
            rolName,
            function (err, results, fields) {
              const concatenatedName = 'CONCAT(first_name, " ", second_name)';
              const rolIDArray = results.map((row) => row.id);
              //console.log('rol ID', rolIDArray);
              const singleRolId = rolIDArray[0];
              const sql = `UPDATE employee SET role_id = ? WHERE ${concatenatedName} = ?`;
              db.query(
                sql,
                [singleRolId, employeeName],
                function (err, results, fields) {
                  console.log("Updated employee's role");
                  //console.table(results);
                  initFunction();
                }
              );
            }
          );
        });
      });
    }
  );
};

const viewAllRoles = () => {
  //console.log('This is the viewAllRoles(); funciton');
  db.query(
    'SELECT r.id AS Rol_ID, r.title as Title , r.salary AS Salary, d.name as Department_Name FROM rol r JOIN department d ON r.department_id = d.id',
    function (err, results, fields) {
      console.table(results);
      initFunction();
    }
  );
};

const addRole = () => {
  db.query('SELECT name from DEPARTMENT', function (err, results, fields) {
    const departmentNamesArray = results.map((row) => row.name);
    const addRoleQuestions = [
      {
        type: 'text',
        name: 'newtitle',
        message: 'What is the title of the new role?',
      },
      {
        type: 'number',
        name: 'newSalary',
        message: 'What is the salary for the new role?',
      },
      {
        type: 'list',
        name: 'departmentName',
        message: 'What department does it belong to?',
        choices: departmentNamesArray,
      },
    ];

    const roleInfo = [];
    inquirer.prompt(addRoleQuestions).then((answ) => {
      const roleTitle = answ.newtitle;
      const roleSalary = answ.newSalary;
      const roleDepartment = answ.departmentName;

      db.query(
        `SELECT id FROM department WHERE name = ?`,
        roleDepartment,
        function (err, results, fields) {
          const departmentIDArray = results.map((row) => row.id);
          //console.log('RROLE RESULTS', departmentIDArray[0]);

          roleInfo.push(roleTitle, roleSalary, departmentIDArray[0]);
          //console.log('R INFO', roleInfo);

          const sql = `INSERT INTO rol(title, salary, department_id) VALUES (?, ?, ?)`;
          //console.log('ROL INFORMATION', roleInfo);
          db.query(sql, roleInfo, function (err, results, fields) {
            console.log(`Added ${roleTitle} to the database`);
            //console.table(results);
            initFunction();
          });
        }
      );
    });
  });
};

const addDepartment = () => {
  //console.log('This is the addDepartment() funciton');
  inquirer.prompt(addDepartmentQuestions).then((answ) => {
    const departmentName = answ.newDepartment;
    //console.log('DEPARTMENTS INFORMATION', departmentName);
    const sql = `INSERT INTO department(name) VALUES (?)`;
    db.query(sql, departmentName, function (err, results, fields) {
      if (err) {
        console.log(err);
      }
      console.log(`Added ${departmentName} to the database;`);
      //console.table(results);
      initFunction();
    });
  });
};

const viewAllDepartments = () => {
  const sql = `SELECT name FROM department`;
  db.query(sql, function (err, results, fields) {
    console.table(results);
    initFunction();
  });
};

const updateManager = () => {
  const concatenatedName = 'CONCAT(first_name, " ", second_name)';
  db.query(
    `SELECT ${concatenatedName} AS full_name FROM employee WHERE manager_id IS NOT NULL`,
    function (err, results, fields) {
      const employeeNames = results.map((row) => row.full_name);
      //console.log('UPDATE MANAGER; EMPLOYEES NAME', employeeNames);

      db.query(
        'SELECT CONCAT(first_name, " ", second_name) AS full_name FROM employee WHERE manager_id IS NULL',
        function (err, results, fields) {
          if (err) {
            console.log(err);
          }
          const managerNames = results.map((row) => row.full_name);
          //console.log('UPDATE MANAGER RESULTS', managerNames);
          const updateManagerQuestions = [
            {
              type: 'list',
              name: 'employeeName',
              message: "Who is the employee's manager to update?",
              choices: employeeNames,
            },
            {
              type: 'list',
              name: 'managerName',
              message: 'Who is gonna be the new manager of the employee?',
              choices: managerNames,
            },
          ];
          inquirer.prompt(updateManagerQuestions).then((answ) => {
            const employeeName = answ.employeeName;
            const concatenatedName = 'CONCAT(first_name, " ", second_name)';
            const managerName = answ.managerName;
            //console.log('ACTUAL MANAGER NAME', managerName);
            db.query(
              `SELECT id FROM employee WHERE ${concatenatedName} = "${managerName}"`,
              function (err, results, fields) {
                const managerIDArray = results.map((row) => row.id);
                const managerID = managerIDArray[0];
                if (err) {
                  console.log(err);
                }
                //console.log('UPDATE MANAGER, MANAGER ID', managerID);

                db.query(
                  `UPDATE employee SET manager_id = ${managerID} WHERE ${concatenatedName} = "${employeeName}"`,
                  function (err, results, fields) {
                    console.log(`Updated Manager for ${employeeName}`);
                    //console.table(results);
                    initFunction();
                  }
                );
              }
            );
          });
        }
      );
    }
  );

  // db.query();
};

const quitProgramm = () => {
  console.log('Exiting the program...');
  process.exit(0);
};

const initFunction = () => {
  inquirer.prompt(questions).then((answ) => init(answ));
  const init = (answ) => {
    switch (answ.initialQuestion) {
      case 'View All Employees':
        viewAllEmployees();
        break;
      case 'Add Employee':
        addEmployee();
        break;
      case 'Update Employee role':
        updateEmployeeRole();
        break;
      case 'View All Roles':
        viewAllRoles();
        break;
      case 'Add Role':
        addRole();
        break;
      case 'View All departments':
        viewAllDepartments();
        break;
      case 'Add Department':
        addDepartment();
        break;
      case 'Update Manager':
        updateManager();
        break;
      case 'Quit':
        quitProgramm();
        break;
      // case "Quit App":
      //   quitApp();
      //   break;
    }
  };
};

initFunction();
