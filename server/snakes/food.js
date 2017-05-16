const MAX_COUNT_FOOD = 20;
let food = [];

let startGeneratingFood = (clients) => {
	setInterval(() => {
	  if (food.length > MAX_COUNT_FOOD) {
	    return;
	  }
	  let data = {
	    type: 'food',
	    x: (Math.random() * 1000),
	    y: (Math.random() * 1000),
	    color: `rgb(${Math.random() * 255 >> 0}, ${Math.random() * 255 >> 0}, ${Math.random() * 255 >> 0})`
	  };
	  food.push(data);
	  clients.forEach((client) => {
	    client.send(JSON.stringify(data));
	  });
	}, 3000);	
} 

let deleteFood = (x, y) => {
  food.forEach((element) => {
    if ((element.x % (700 - 2 * (20 + 5) ) + 20 + 5) == x &&
        (element.y % (500 - 2 * (20 + 5) ) + 20 + 5) == y) {
      food.splice(food.indexOf(element), 1);
      return;
    }
  });
}

module.exports.startGeneratingFood = startGeneratingFood;
module.exports.deleteFood = deleteFood;
module.exports.arrayOfFood = food;
