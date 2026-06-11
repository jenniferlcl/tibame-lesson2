require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRouter = require('./routes/auth');
const dashboardRouter = require('./routes/dashboard');
const vehiclesRouter = require('./routes/vehicles');
const employeesRouter = require('./routes/employees');
const auditRouter = require('./routes/audit');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/vehicles', vehiclesRouter);
app.use('/api/employees', employeesRouter);
app.use('/api/audit-log', auditRouter);

app.use((req, res) => res.status(404).json({ message: 'Not found' }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
