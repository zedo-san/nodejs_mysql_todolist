const express = require('express');
const exphbs = require('express-handlebars');
const todoRoute = require('./routes/todo-route');
const path = require('path');


//############ Setting up Express ###############//
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended:false }));
app.use(express.static(path.join(__dirname, '../public')));


//######### Setting up view engine ##################//
app.set("views", 'views');
app.engine('hbs', exphbs({
        defaultLayout: 'main',
        extname: 'hbs'
    })
);
app.set('view engine', 'hbs');

//########### routes ###########//
app.use('/', todoRoute);


//############## Listening to Port 3030 ############///
const PORT = 3030;
app.listen(PORT, () => {
    console.log(`Server up and running on port ${PORT}`);
});