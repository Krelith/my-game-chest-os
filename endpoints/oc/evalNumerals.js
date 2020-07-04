module.exports = {
  evalNumerals(name1, name2) {
    this.name1 = name1.toUpperCase();
    this.name2 = name2.toUpperCase();
    if (
      (this.name1.includes(' 2') &&
        this.name2.includes(' II') &&
        !this.name2.includes(' III')) ||
      (this.name1.includes(' II') &&
        !this.name1.includes(' III') &&
        this.name2.includes(' 2'))
    ) {
      return true;
    } else if (
      (this.name1.includes(' 3') && this.name2.includes(' III')) ||
      (this.name1.includes(' III') && this.name2.includes(' 3'))
    ) {
      return true;
    } else if (
      (this.name1.includes(' 4') && this.name2.includes(' IV')) ||
      (this.name1.includes(' IV') && this.name2.includes(' 4'))
    ) {
      return true;
    } else if (
      (this.name1.includes(' 5') && this.name2.includes(' V')) ||
      (this.name1.includes(' V') && this.name2.includes(' 5'))
    ) {
      return true;
    } else if (
      (this.name1.includes(' 6') && this.name2.includes(' VI')) ||
      (this.name1.includes(' VI') && this.name2.includes(' 6'))
    ) {
      return true;
    } else if (
      (this.name1.includes(' 7') && this.name2.includes(' VII')) ||
      (this.name1.includes(' VII') && this.name2.includes(' 7'))
    ) {
      return true;
    } else if (
      (this.name1.includes(' 8') && this.name2.includes(' VIII')) ||
      (this.name1.includes(' VIII') && this.name2.includes(' 8'))
    ) {
      return true;
    } else if (
      (this.name1.includes(' 9') && this.name2.includes(' IX')) ||
      (this.name1.includes(' IX') && this.name2.includes(' 9'))
    ) {
      return true;
    } else if (
      (this.name1.includes(' 10') && this.name2.includes(' X')) ||
      (this.name1.includes(' X') && this.name2.includes(' 10'))
    ) {
      return true;
    } else if (
      (this.name1.includes(' 11') && this.name2.includes(' XI')) ||
      (this.name1.includes(' XI') && this.name2.includes(' 11'))
    ) {
      return true;
    } else if (
      (this.name1.includes(' 12') && this.name2.includes(' XII')) ||
      (this.name1.includes(' XII') && this.name2.includes(' 12'))
    ) {
      return true;
    } else if (
      (this.name1.includes(' 13') && this.name2.includes(' XIII')) ||
      (this.name1.includes(' XIII') && this.name2.includes(' 13'))
    ) {
      return true;
    } else if (
      (this.name1.includes(' 14') && this.name2.includes(' XIV')) ||
      (this.name1.includes(' XIV') && this.name2.includes(' 14'))
    ) {
      return true;
    } else if (
      (this.name1.includes(' 15') && this.name2.includes(' XV')) ||
      (this.name1.includes(' XV') && this.name2.includes(' 15'))
    ) {
      return true;
    } else if (
      (this.name1.includes(' 16') && this.name2.includes(' XVI')) ||
      (this.name1.includes(' XVI') && this.name2.includes(' 16'))
    ) {
      return true;
    } else {
      return false;
    }
  }
};
