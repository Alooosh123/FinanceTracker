FinanceTracker: Personal Financial Management Tool 

Author: Alaa Alameri

Project Overview

FinanceTracker is a comprehensive, full-stack application designed to empower individuals to manage their finances independently. It offers a structured way to track every financial transaction, providing users with the tools to categorize, set budgets, and gain insights into their financial health through visual data representations (charts and graphs). The project is built on a modern React frontend communicating with a robust Node.js backend, with data persistence handled by MySQL.

Key Features

    Income and Expense Tracking: Record all monetary inflows and outflows with ease.

    Categorization: Assign detailed categories to transactions for better analysis and organization.

    Budget Setting: Ability to create and monitor personal budgets for specific categories to manage spending effectively.

    Data Visualization: Present financial data through intuitive charts and visuals for quick insight into spending habits and financial status.

    Local Data Persistence: Data is stored securely in a local MySQL database, ensuring control and privacy over personal financial records.

Technology Stack

FinanceTracker is a full-stack application utilizing the following technologies:
Component	Technology	Description
Frontend	React	Used for building a fast, dynamic, and interactive user interface.
Backend	Node.js	Provides the server-side environment for handling API requests, application logic, and connecting to the database.
Database	MySQL	A robust relational database used for secure and structured storage of all financial data (transactions, categories, budgets).
Development Server	WAMP/XAMPP	Required for running the local MySQL database instance.
Main Entry Point	main.jsx	The core file for launching the React frontend application.

Installation & Setup

Running the FinanceTracker application requires setting up both the backend Node.js server, the React frontend, and the MySQL database.

Prerequisites

Before you begin, ensure you have the following installed:

    Node.js: Required for both running the backend server and managing React dependencies.

    WAMP/XAMPP: Required to run the local MySQL database instance.

    NPM/Yarn: A package manager for installing project dependencies.

Steps

    Clone the Repository:
    Bash

    git clone <repository_url>
    cd FinanceTracker

    Database Setup (MySQL via WAMP/XAMPP): a. Ensure your WAMP/XAMPP server is running, particularly the MySQL service. b. Access phpMyAdmin (usually via http://localhost/phpmyadmin). c. Create a new database named exactly: finance_tracker. d. (If applicable) Import any initial database schema or tables required for the project.

    Backend Setup (Node.js): a. Navigate to the backend folder (e.g., cd backend/ or the appropriate folder). b. Install dependencies: bash npm install c. Configure Database Connection: Update the database connection credentials (username, password, port) within the backend configuration files to match your local WAMP/MySQL setup. d. Start the Backend Server: bash node server.js # (or the appropriate command to start your Node.js server)

    Frontend Setup (React): a. Navigate to the frontend folder (e.g., cd frontend/ or the appropriate folder). b. Install dependencies: bash npm install c. Configure Server Link: Ensure the React application's API endpoints are configured to correctly point to the running Node.js backend server (e.g., specifying the correct port, which should be documented within your code). d. Run the Frontend: The application starts from main.jsx. bash npm start # (or the appropriate command to launch the React development server)

    Access the Application: The application will usually open automatically in your browser (e.g., http://localhost:3000).

Usage

    Dashboard: Upon launching, the application presents a clear overview of your current financial status.

    Transaction Entry: Input new revenues or expenses, ensuring you assign the correct category.

    Budgeting: Navigate to the budget section to set limits on specific spending categories.

    Analysis: Review the charts and graphs to track spending trends and monitor progress towards your financial goals.
