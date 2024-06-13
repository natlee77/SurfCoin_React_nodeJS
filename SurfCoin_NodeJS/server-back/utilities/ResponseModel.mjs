export default class ResponseModel {
  constructor({ statusCode = 404, data = null, error = null }) {
    this.statusCode = statusCode;
    this.success = statusCode >= 200 && statusCode < 300;
    this.error = error;

    if (Array.isArray(data)) {
      this.items = data.length;
    } else if (data && typeof data === 'object' && data.chain) {
      this.items = data.chain.length;
    } else {
      this.items = 0;
    }

    this.data = data;
  }
}
