export default class APIFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  Pagination() {
    let page = this.queryString.page * 1 || 1;
    if (page <= 0) page = 1;
    let skip = (page - 1) * 4;
    this.page = page;
    this.mongooseQuery.skip(skip).limit(4);
    return this;
  }

  Filter() {
    let filterObj = { ...this.queryString };
    let excluded = ["page", "fields", "keyword", "sort"];
    excluded.forEach((ele) => {
      delete filterObj[ele];
    });
    filterObj = JSON.stringify(filterObj);
    filterObj = filterObj.replace(/\bgt|gte|lt|lte\b/g, (match) => `$${match}`);
    filterObj = JSON.parse(filterObj);
    this.mongooseQuery.find(filterObj);
    return this;
  }

  Sort() {
    if (this.queryString.sort) {
      let sortBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery.sort(sortBy);
    }
    return this;
  }

  Search() {
    if (this.queryString.keyword) {
      this.mongooseQuery.find({
        $or: [
          { title: { $regex: this.queryString.keyword, $options: "i" } },
          { description: { $regex: this.queryString.keyword, $options: "i" } },
          { slug: { $regex: this.queryString.keyword, $options: "i" } },
        ],
      });
    }
    return this;
  }
  Fields() {
    if (this.queryString.fields) {
      let fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery.select(fields);
    }
    return this;
  }
}
