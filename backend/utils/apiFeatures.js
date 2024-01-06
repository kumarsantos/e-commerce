export class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: 'i',
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    //to get the deep copy so it wont affect original array
    const queryCopy = { ...this.queryStr };
    //removing some fields for category
    const removeFields = ['keyword', 'page', 'limit'];
    removeFields.forEach((key) => delete queryCopy[key]);

    //Filter for price and Rating for range
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`); //this for adding $ as prefix for keys because mongodb understands $lte or $gte etc.

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = (currentPage - 1) * resultPerPage; //how many has to skip
    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }
}
