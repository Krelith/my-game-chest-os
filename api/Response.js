class Response {
  constructor(success, data, msg) {
    this.success = success;
    this.data = data || null;
    this.msg = msg || '';
    return {
      success: this.success,
      data: this.data,
      msg: this.msg
    };
  }
}

module.exports = Response;
