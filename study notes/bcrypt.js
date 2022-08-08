const bcrypt = require('bcrypt');
const saltRounds = 8;
const myPlaintextPassword = 'monkey';
const someOtherPlaintextPassword = 'dragon';


// Synchronous method
// const salt = bcrypt.genSaltSync(saltRounds)
// const hash = bcrypt.hashSync(myPlaintextPassword, salt);
// console.log(salt)
// console.log(hash)

// bcrypt.compareSync(myPlaintextPassword, hash); // true
// bcrypt.compareSync(someOtherPlaintextPassword, hash); // false


// if (bcrypt.compareSync(myPlaintextPassword, hash)) {
//     console.log('password matched!!')
// }
// if (!bcrypt.compareSync(someOtherPlaintextPassword, hash)) {
//     console.log('password NOT matched!!')
// }

// async method:
const hashpassword = async (pw) => {
    const salt = await bcrypt.genSalt(saltRounds)
    const hash = await bcrypt.hash(pw, salt);
    console.log(salt)
    console.log(hash)
}


const login = async (pw, hashedPw) => {
    const result = await bcrypt.compare(pw, hashedPw);
    if (result) {
        console.log('success match! Logged you in! ')
    } else {
        console.log("incorrect!")
    }
}

// hashpassword(myPlaintextPassword)


login(myPlaintextPassword, '$2b$10$tCfdDKMJ4JW3BlNkLafzUe6WrZdjGXkitJrtlxH.tiy4NnsfMJY7.')
// login('monkey', '$2b$10$QmUBiBWvSYgV19TzwjPZLeoM1whvX1bYpQk5PF9NA59jT/.wyKiqq')


