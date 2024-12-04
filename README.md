# **Chat System Setup Guide**

This guide explains how to set up and run the Chat System project, which includes a backend (FastAPI) and a frontend (React). Follow these steps carefully.

---

## **Prerequisites**

Ensure the following software is installed on your machine:

1. **Python** (>=3.9)  
   - Download from [python.org](https://www.python.org/).
   - Make sure to add Python to your system PATH during installation.

2. **Node.js** (>=16.x) and npm  
   - Download from [nodejs.org](https://nodejs.org/).

3. **Git** (optional but recommended for version control)  
   - Download from [git-scm.com](https://git-scm.com/).

---

## **Project Setup**

### **Step 1: Clone the Repository**
Clone the project repository to your local machine:
```bash
git clone https://github.com/abdoessordo/chat_system.git
cd chat_system
```

### **Step 2: Set Up the Backend**

Navigate to the backend directory:
```bash
cd back
```

Create a virtual environment:
```bash
python -m venv back-env
```

Activate the virtual environment:

On Windows:
```cmd
back-env\Scripts\activate
```

Install the required Python packages:
```bash
pip install -r requirements.txt
```

Run the backend server:
```bash
uvicorn src.main:app --host 0.0.0.0 --port 8000
```

### **Step 3: Set Up the Frontend**

Navigate to the frontend directory:
```bash
cd front
```

Install the required npm packages:
```bash
npm install
```

Start the frontend development server:
```bash
npm run dev
```
---

### **Running Both Servers**

To simplify the setup process, use the provided `start.bat` script:

1. Open a terminal in the project’s root directory.
2. Run the script:
    ```cmd
    start.bat
    ```

This will:
- Activate the backend's virtual environment and start the backend server.
- Start the frontend server.
---

### **Project Structure**

```plaintext
project/
│
├── back/                   # Backend code
│   ├── back-env/           # Python virtual environment (excluded from Git)
│   ├── src/                # Backend source code
│   │   └── main.py         # FastAPI entry point
│   ├── requirements.txt    # Python dependencies
│   └── .gitignore          # Git exclusion rules
│
├── front/                  # Frontend code
│   ├── src/                # React source code
│   ├── public/             # Static assets
│   ├── package.json        # npm dependencies and scripts
│   └── node_modules/       # Node.js dependencies (excluded from Git)
│
├── start.bat               # Script to start backend and frontend
└── README.md               # Project documentation
```
---

### **Testing the Application**

Open your browser and navigate to:

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:8000/docs](http://localhost:8000/docs) (FastAPI Swagger UI for API testing)

Start chatting and test the functionality!


