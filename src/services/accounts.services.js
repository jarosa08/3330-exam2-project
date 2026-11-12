const users = [
  {
    firstName: "John",
    lastName: "Doe",
    dob: "1999-01-02",
    gender: "male",
    email: "johndoe@gmail.com",
    password: "123",
    accountType: "ORGANIZER",
  },
  {
    firstName: "Jane",
    lastName: "Doe",
    dob: "1999-01-02",
    gender: "female",
    email: "janedoe@gmail.com",
    password: "123",
    accountType: "RUNNER",
  }
];

const findUser = (body) => {
    return users.find( (user) => user.email.toLowerCase() === body["emailinput"].toLowerCase());
}

const addUser = (body) => {

    const newUser = {
        firstName: body["first-name-input"],
        lastName: body["last-name-input"],
        dob: body["DOB-input"],
        gender: body["gender-input"],
        email: body["emailinput"],
        password: body["passwordinput"],
        accountType: body["type-input"] 
    };
    users.push(newUser);
    return newUser;
}

export default {findUser, addUser}