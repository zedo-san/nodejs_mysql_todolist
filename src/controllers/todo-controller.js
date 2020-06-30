const mysql = require('mysql');
const passwordHash = require('password-hash');

let con = mysql.createConnection({
  host: "localhost",
  user: "cpe",
  password: "",
  database: "todo_list_app_nodejs"
});

//################# Lists ######################
exports.getTodoList = (req, res) => {
    if(!con._connectCalled ) {
        con.connect(err => {
            if (err) throw err;
    
            console.log("Connected to Database");

        });
    }

    let loggedInUser = `SELECT id FROM users WHERE username = '${req.params.username}'`;
    con.query(loggedInUser, (err, currentUser) => {
        let currentId= currentUser[0].id;

        let getAllLists = 'SELECT * FROM `list`';
        con.query(getAllLists, (err, allLists) => {

            let lists = [];
            allLists.forEach(list => {
                lists.push({
                    id: list.id,
                    listName: list.listName,
                    owner: list.owner,
                    userId: list.userId,
                    isOwner: list.userId === currentId ? true : false,
                    username: req.params.username
                });
            });
            res.render('list', {
                lists: lists,
                username: req.params.username
            });
        });
    });
   
   
}
exports.createList = (req, res) => {
    let listName = req.body.mylist;
    if(!con._connectCalled ) {
        con.connect(err => {
            if (err) throw err;
    
            console.log("Connected to Database");
            
        });
    }
    let getUser = `SELECT * FROM users WHERE username = '${req.params.username}'`;
    con.query(getUser, (err, user) => {
        let createList = `INSERT INTO list (listname, owner, userId) VALUES ('${listName}', '${user[0].name}', ${user[0].id})`;
        
        con.query(createList, (err, result) => {
            res.redirect(`/list/${req.params.username}`);
        });
    });
    
}

// ################## Delete List Item ###############//
exports.deleteListItem = (req, res) => {
    let deleteItem = `DELETE FROM list WHERE id = ${req.params.listid}`;
    con.query(deleteItem, (err, result) => {
        res.redirect(`/list/${req.params.username}`);
    });
}

//##################### Login Requests ############## //
exports.getLoginPage = (req, res) => {
    res.render('login');
}

exports.submitLogin = (req, res) => {
    let username = req.body.username,
        pass = req.body.pass;
    if(!con._connectCalled ) {
        con.connect(err => {
            if (err) throw err;
    
            console.log("Connected to Database");
            
        });
    }
    
    let getUser ='SELECT * FROM `users` WHERE `username` = '+ `'${username}'`;

    con.query(getUser, (err, user) =>{
        if(user.length == 0){
            res.render('login', {
                hasError: true,
                errorMsg: 'Username not found'
            });
        }
        else{
            let getUserPass ='SELECT * FROM `users` WHERE `username` = '+ `'${username}'`;
            con.query(getUserPass, (err, userPass) => {
                let hashedPass = userPass[0].pass;
                const isCorrectPass = passwordHash.verify(pass, hashedPass);
                if(isCorrectPass){
                  
                    res.redirect(`/list/${userPass[0].username}`);
                }
                else{
                    res.render('login', {
                        hasError: true,
                        errorMsg: 'Incorrect Password'
                    });
                }
            });
        }
    });
}


// ############ Register Requests ################## //
exports.getRegisterPage = (req, res) => {
    res.render('register');
}
exports.submitRegistration = (req, res) => {
    let fullname = req.body.fullname,
        username = req.body.username,
        pass1 = req.body.pass,
        pass2 = req.body.confPass

    if(!con._connectCalled ) {
        con.connect(err => {
            if (err) throw err;
    
            console.log("Connected to Database");
            
        });
    }
    let getUser ='SELECT * FROM `users` WHERE `username` = '+ `'${username}'`;
    con.query(getUser, (err, similar) =>{
        if(similar.length != 0){
            res.render('register', {
                hasError: true,
                errorMsg: 'Username already taken'
            });
        }
        else{
            if(pass1 === pass2){
                const hashedPass = passwordHash.generate(pass2);
                let sql = `INSERT INTO users (name, username, pass) VALUES ('${fullname}', '${username}', '${hashedPass}')`;
                
                con.query(sql, (err, result) => {
                    if(err) throw err;
                    res.redirect('/login');
                });
            }
            else{
                res.render('register', {
                    hasError: true,
                    errorMsg: 'Password did not match'
                });
            }
        }
    });
    
}


// ############### Logout ##################### //
exports.logout = (req, res) => {
    res.redirect('/login')
}