export function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

export function Compare(a, b) {
    const topA = a.y;
    const topB = b.y;
  
    let comparison = 0;
    if (topA > topB) {
      comparison = 1;
    } else if (topA < topB) {
      comparison = -1;
    }
    return comparison;
}

export function isCollide(a, b) {
    return !(
        ((a.y + a.height) < (b.y)) ||
        (a.y > (b.y + b.height)) ||
        ((a.x + a.width) < b.x) ||
        (a.x > (b.x + b.width))
    );
}

export function CheckTextHealth(x) {

  var reg = /<(.|\n)*?>/g;

  if (reg.test(x) == true) {
      return false;

  }else{
      return true;
  }
}