const express = require('express');
const { addUser, deleteUser, getAllUsers, updateProblems, getAllProblems, getAllData } = require("./../controllers/userControllers")

const router = express.Router();

router.post("/adduser", addUser);
router.post("/deleteuser", deleteUser);
router.get("/getallusers", getAllUsers);
router.get("/update-problems", updateProblems);
router.post("/getallproblems", getAllProblems);

router.get("/getalldata", getAllData);

module.exports =  router;