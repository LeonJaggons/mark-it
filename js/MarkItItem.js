class MarkItItem {
    constructor(user, title, description, price, tags) {
        this.user = user;
        this.title = title;
        this.description = description;
        this.price = price;
        this.tags = tags;
    }

    get(itemAttr) {
        return this[[itemAttr]];
    }

    set(itemAttr, value) {
        return (this[[itemAttr]] = value);
    }
}

export default MarkItItem;