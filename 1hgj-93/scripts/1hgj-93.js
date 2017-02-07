RocketBoots.loadComponents([
	"StateMachine",
	"Loop",
	"Incrementer"
]).ready(function(rb){

	var  
		BLOCKS_PER_WORLD = 200,
		TILES_PER_BLOCK = 6, // want: 64,
		TILES_PER_WORLD = BLOCKS_PER_WORLD * TILES_PER_BLOCK,
		PIXELS_PER_TILE = 16,
		PIXELS_PER_WORLD = TILES_PER_WORLD * PIXELS_PER_TILE;
	var PPT = PIXELS_PER_TILE; // alias


////===== Game, World, Loop, States

	window.g = new RocketBoots.Game({
		name: "Fake News",
		instantiateComponents: [
			{"state": "StateMachine"},
			{"loop": "Loop"},
			{"incrementer": "Incrementer"}
		]
	});


	g.state.addStates({
		"start": {

		},
		"game": {
			viewName: "game",
			start: function(){
				g.loop.start();
			},
			end: function(){

			}
		},
		"paused": {
			start: function(){

			},
			end: function(){

			}			
		}
	});

	g.loop.set(function(){
		g.incrementer.incrementByElapsedTime(undefined, true);
		g.incrementer.calculate();
	}, 200)

	g.incrementer.addCurrencies([
		{
			name: "articleProgress",
			displayName: "Article Progress",
			tip: "",
			min: 0,
			max: 100,
			calcRate: function(c){
				if (c.articleProgress.val === 100) {
					c.articleProgress.val = 0;
					c.articles.add(1);
				}
				return c.writers.val; 
			}
		},{
			name: "writers",
			displayName: "Writers",
			tip: "",
			min: 0,
			max: Infinity
		},{
			name: "articles",
			displayName: "articles",
			tip: "",
			min: 0,
			max: Infinity
		},{
			name: "readers",
			displayName: "Readers",
			tip: "",
			min: 0,
			max: Infinity,
			calcRate: function(c){
				return c.articles.val;
			}
		},{
			name: "lobbyists",
			displayName: "lobbyists",
			tip: "",
			min: 0,
			max: Infinity
		},{
			name: "lobbyProgress",
			displayName: "lobbyProgress",
			tip: "",
			min: 0,
			max: 100,
			calcRate: function(c){
				if (c.lobbyProgress.val === 100) {
					c.lobbyProgress.val = 0;
					c.politicians.add(1);
				}
				return c.lobbyists.val; 
			}
		},{
			name: "politicians",
			displayName: "politicians",
			tip: "",
			min: 0,
			max: Infinity
		},{
			name: "money",
			displayName: "Money",
			tip: "",
			min: 0,
			max: Infinity,
			calcRate: function(c){
				return c.readers.val;
			}
		}
	]);

	var curr = g.incrementer.currencies;

	$('button.write').click(function(e){
		curr.articleProgress.add(1);
	});
	$('button.lobby').click(function(e){
		curr.lobbyProgress.add(1);
	});
	$('button.discredit').click(function(e){
		var pols = curr.politicians.val;
		curr.politicians.subtract(1);
		if (curr.politicians.val < pols) {
			curr.readers.add(100);
		}
	});
	$('button.hire').click(function(e){
		var ogMoney = curr.money.val;
		curr.money.subtract(1000);
		if (curr.money.val <= (ogMoney - 1000)) {
			curr.writers.add(1);
		}
	});
	$('button.donate').click(function(e){
		var ogMoney = curr.money.val;
		curr.money.subtract(1000);
		if (curr.money.val <= (ogMoney - 1000)) {
			curr.politicians.add(1);
		}		
	});

	g.state.transition("game");	

	

});