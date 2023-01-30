

const formantName = (name) => {
    let name_ = name;
    let splitName = name_.split(' ');

    let nameToUpperCase = [];

    for (let i of splitName) {
    nameToUpperCase.push(`${i.substr(0,1).toUpperCase()}${i.substr(1).toLowerCase()}`);
    }

    name_ = nameToUpperCase.join(' ');
    return name_;
}



module.exports = { 
    formantName
};