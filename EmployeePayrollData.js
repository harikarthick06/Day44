class EmployeePayrollData {
    constructor() {
        this._id = this.createNewEmployeeId();
        this._name = "";
        this._profilePic = "";
        this._gender = "";
        this._department = [];
        this._salary = "";
        this._startDate = "";
        this._note = "";
    }

    get id() { return this._id; }
    set id(id) { this._id = id; }

    get name() { return this._name; }
    set name(name) {
        const nameRegex = /^[A-Z][a-zA-Z\s]{2,}$/;
        if (nameRegex.test(name)) {
            this._name = name;
        } else {
            throw "Name is incorrect. Name should start with a capital letter and have minimum 3 characters.";
        }
    }

    get profilePic() { return this._profilePic; }
    set profilePic(profilePic) { this._profilePic = profilePic; }

    get gender() { return this._gender; }
    set gender(gender) { this._gender = gender; }

    get department() { return this._department; }
    set department(department) { this._department = department; }

    get salary() { return this._salary; }
    set salary(salary) { this._salary = salary; }

    get startDate() { return this._startDate; }
    set startDate(startDate) {
        const date = new Date(startDate);
        const today = new Date();
        const pastLimit = new Date();
        pastLimit.setDate(today.getDate() - 30);

        if (date > today) {
            throw "Start date cannot be a future date.";
        }
        if (date < pastLimit) {
            throw "Start date should be within the past 30 days.";
        }
        this._startDate = startDate;
    }

    get note() { return this._note; }
    set note(note) { this._note = note; }

    createNewEmployeeId() {
        return Math.floor(Math.random() * 1000000);
    }

    toString() {
        const options = { year: "numeric", month: "long", day: "numeric" };
        const empDate = this.startDate ? new Date(this.startDate).toLocaleDateString("en-US", options) : "undefined";
        return "id=" + this.id +
            ", name=" + this.name +
            ", gender=" + this.gender +
            ", profilePic=" + this.profilePic +
            ", department=" + this.department +
            ", salary=" + this.salary +
            ", startDate=" + empDate +
            ", note=" + this.note;
    }
}
