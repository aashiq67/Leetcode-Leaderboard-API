const User = require("./../models/userModel");

module.exports.addUser = async (req, res, next) => {
    try {
        const { username, userprofile } = req.body;

        const check_username = await User.findOne({ username });
        if (check_username)
            return res.status(true).json({ message: "Username Already Exists." });

        const check_userprofile = await User.findOne({ userprofile });
        if (check_userprofile)
            return res.status(true).json({ message: "Userprofile Already Exists." });

        const response = await fetch("https://leetcode.com/graphql", {
            method: "POST",

            body: JSON.stringify({
                query: "\n query userProblemsSolved($username: String!) {\n allQuestionsCount {\n difficulty\n count\n } \n matchedUser(username: $username) {\n problemsSolvedBeatsStats {\n difficulty\n percentage\n }\n submitStatsGlobal {\n acSubmissionNum {\n difficulty\n count\n }\n }\n }\n}\n ",
                variables: {
                    "username": `${userprofile}`
                }
            }),

            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })

        const data = await response.json();
        const allques = data.data.matchedUser.submitStatsGlobal.acSubmissionNum;
        const ques = [allques[1].count, allques[2].count, allques[3].count, allques[0].count]
        const date = new Date();
        const now = date.toLocaleDateString();

        const myMap = new Map();
        myMap.set(`${now}`, [{ques: ques, solved: 0}])
        const newUser = new User({
            username,
            userprofile,
            progress: myMap,
        })
        newUser.save();
        console.log("User added successfully");
        return res.json({ message: "User added successfully" });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports.deleteUser = async (req, res, next) => {
    try {
        const { username } = req.body;

        const checkUsername = await User.findOne({username});
        if(!checkUsername)
            return res.json({ message: "no user found" })

        const response = await User.deleteOne({username});
        
        if (response){
            console.log("successfully deleted");
            return res.json({ message: "successfully deleted" })
        }
        else{
            console.log("failed to delete");
            return res.json({ message: "failed to delete" })
        }
    
    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select(["username"]);
        return res.json({users});
    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports.updateProblems = async (req, res, next) => {
    try {
        const users = await User.find();
        
        users.forEach(async (user)=>{
            const userprofile = user.userprofile;
            const response = await fetch("https://leetcode.com/graphql", {
                method: "POST",

                body: JSON.stringify({
                    query: "\n query userProblemsSolved($username: String!) {\n allQuestionsCount {\n difficulty\n count\n } \n matchedUser(username: $username) {\n problemsSolvedBeatsStats {\n difficulty\n percentage\n }\n submitStatsGlobal {\n acSubmissionNum {\n difficulty\n count\n }\n }\n }\n}\n ",
                    variables: {
                        "username": `${userprofile}`
                    }
                }),

                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })

            const data = await response.json();
            const allques = data.data.matchedUser.submitStatsGlobal.acSubmissionNum;
            const ques = [allques[1].count, allques[2].count, allques[3].count, allques[0].count]
            
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate()-1);
            const today_date = today.toLocaleDateString();
            const yesterday_date = yesterday.toLocaleDateString();
            
            let isUpdated;
            if(!user.progress.has(today_date)) {
                const new_solved = ques[3] - user.progress.get(yesterday_date)[0].ques[3];
                const Value = { ques: ques, solved: new_solved };
                isUpdated = await User.updateOne({ userprofile }, { $push: { [`progress.${today_date}`]: Value}})
            } 
            else {
                const new_solved = ques[3] - user.progress.get(today_date)[0].ques[3];
                const old_solved = user.progress.get(today_date)[0].solved;
                isUpdated = await User.updateOne({ userprofile }, { $set: { [`progress.${today_date}`]: [{ques: ques, solved: old_solved+new_solved}] } } )
            }
            
            if (!isUpdated)
                return res.json({ message: "not updated successfully" });
        })
        console.log("Problems updated successfully");
        return res.json({ message: "Problems updated successfully" });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports.getAllProblems = async (req, res, next) => {
    try {
        const {username} = req.body;
        const response = await User.findOne({username}).select(["progress"])

        let problems = [];
        for (let i = 1; i < response.progress.length; i++) {
            problems.push({ date: response.progress[i - 1].date, solved: response.progress[i].solved});
        }
        return res.json({message: problems})
    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports.getAllData = async (req, res, next) => {
    try {
        const data = await User.find().select(["username", "progress"]);
        return res.json({ data });
    } catch (error) {
        
    }
}