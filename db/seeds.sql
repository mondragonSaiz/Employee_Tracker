INSERT INTO department(name)
VALUES("Toys"),
      ("Cleaning"),
      ("Electronics");
      


INSERT INTO rol(title, salary, department_id)
VALUES("Toys Dept Manager", 2300.10, 1),
("Toys Dept Sales Manager", 1538.60, 1),
("Toys Dept Assistant Manager", 1125.30, 1),
("Toys Dept Cashier", 825.50, 1),
("Cleaning Dept Manager", 2100.10, 2),
("Cleaning Dept Sales Manager", 1438.60, 2),
("Cleaning Dept Assistant Manager", 1025.30, 2),
("Cleaning Dept Cashier", 725.50, 2),
("Electronics Dept Manager", 2500.10, 3),
("Electronics Dept Sales Manager", 1738.60, 3),
("Electronics Dept Assistant Manager", 1325.30, 3),
("Electronics Dept Cashier", 1225.50, 3);


INSERT INTO employee(first_name, second_name, role_id, manager_id)
VALUES("Miguel", "Ohara", 100, NULL),
      ("Hobbie", "Brown", 101, 200),
      ("Ben", "Reilly", 102, 200),
      ("Peter", "Porker", 103, 200),
      ("Gwen", "Stacy", 104, NULL),
      ("Miles", "Morales", 105, 204),
      ("Pablo", "Dominguez", 106, 204),
      ("Harry", "Osborn", 107, 204),
      ("Penni", "Parker", 108, NULL),
      ("Peter", "Parker", 109, 208),
      ("Aaron", "Davis", 110, 208),
      ("Eddie", "Brook", 111, 208);
