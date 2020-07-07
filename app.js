//Inizializzazione Firebase
const config ={

	apiKey: "AIzaSyBAYcT-s5BMRj3Jm4REBufIsMAbSh-X8WU",
	    authDomain: "ilgomi.firebaseapp.com",
	    databaseURL: "https://ilgomi.firebaseio.com",
	    projectId: "ilgomi",
	    storageBucket: "ilgomi.appspot.com",
	    messagingSenderId: "707130060861",
	    appId: "1:707130060861:web:63061bc39392da6e26fa54",
	    measurementId: "G-T3SY68RJEJ"


};
firebase.initializeApp(config);
const db = firebase.firestore();



//dichiarazione componenti vue


Vue.component('app-body', {
  template:`
	<div class="products-card-container">
	<card v-for="product in products" :item="product"></card>
  </div>`,
	data: function (){
		return {
			products : []								//array di oggetti
		}
	},

	created: function (){
		this.productsRef()
	},

	methods: {
		productsRef : function(){
			var self = this;							//scope this
			db.collection("products")
			.get()												//promise
			.then(function(e){						//puntatore interno
				let Ids = [];								//array di oggetti
				e.forEach(function(doc) {		//ciclo su puntatore
					Ids.push(doc.data())
					});
			self.products = Ids;
			});
		}
	}
});


Vue.component('account-login',{
	template:`<div>
	<input type="text" v-model="email" placeholder="Email">
	<input type="password" v-model="password" placeholder="Password">
	<button @click="login">Login</button>
	</div>`,
	data: function (){
		return {
			 email: this.email,
			 password: this.password
		 }
	},
	methods: {
		login: function (){

			return
		}
}
});

Vue.component('card',{
	template:`<div class="card-container">
		<div class="card-top">
			<div class="card-title">
				<h1>{{item.titolo}}</h1>
				<h4 v-if="item.hasMeasure"> misura: {{item.misura}}</h4>
			</div>

			<div class="card-price">
				<h2 v-bind:class="{'prezzo-scontato' : item.isDiscounted}">{{ item.prezzo }}€</h2>
				<h2 v-if="item.isDiscounted" style="color:red">{{ item.prezzoScontato }}€</h2>
			</div>
		</div>

				<img class="card-image" v-bind:src="'https://picsum.photos/1920/1080'">

		<div class="card-bottom">
				<a><h4>Info</h4></a>
				<a><i class="material-icons">favorite_border</i></a>

					<div class="counter-container">
						<a class="counter-remove"@click="counterRemove"><i class="material-icons">remove</i></a>
						<h4>{{counter}}</h4>
						<a class="counter-add" @click="counterAdd"><i class="material-icons">add</i></a>
					</div>
					<div class="card-buy-button">
						<a><h4>Aggiungi</h4></a>
					</div>


		</div>

	</div>`,
	props: ['item'],
	data: function (){
		return {
			 counter: 0
		 }
	},

	methods: {

		counterAdd: function (){
		return this.counter++;
	},
		counterRemove: function (){
		if (this.counter > 0){
			return this.counter--;
		}
	}
}
});

Vue.component('nav-bar',{
	template: `
<div>

	<div class="top-bar-container">
		<div class="top-nav-bar primary">
			<div class="left-float">
				<ul>
					<li><a href="#" @click="toggle()"><i class="material-icons">menu</i></a></li>
					<li><router-link class="router-link" to="/Home" style="font-family: 'Indie Flower', cursive;font-size:25px">Il Gomitolo</router-link></li>
					<li><router-link class="router-link" to="/Mercato">Go to Mercato</router-link></li>
					<li><router-link to="/Carrello">Go to Carrello</router-link></li>
					<li><router-link to="/Altro">Go to Altro</router-link></li>
				</ul>
			</div>
			<div class="right-float">
				<li><router-link to="/Account">Go to Account</router-link></li>
				<li>Log In</li>
				<li>Register</li>
			</div>
		</div>
	</div>
	
	
	
	<div id="sidebar-menu-shadow" v-bind:class="[sidebarStatus ? 'fade-in' : 'fade-out']">
	<div id="clicker" v-if="sidebarStatus" @click="toggle()"></div>
	</div>
	
	

		
	<div id="sidebar-menu" v-bind:class="[sidebarStatus ? 'menu-sandwitch-active' : 'menu-sandwitch-inactive']">
		  <div class="sidebar-head primary">
			  <div class="sidebar-account-image">
				  <img src="" alt="">
			  </div>
		  </div>
		  		<button @click="toggle()"> chiudi</button>
						<div class="sidebar-body-wrapper">
							<ul>
								<li></li>
								<li></li>
								<li></li>
								<li></li>
								<li></li>
								<li></li>
							</ul>
						</div> 
	</div>
	
	
	
</div>`,
	data: function () {
		return {
			sidebarStatus: false
		}
	},
methods : {
	toggle: function (){
			this.sidebarStatus = !this.sidebarStatus
		}
	}
});


//placeholder per VueRouter

const Home = { template: '<app-body></app-body>' }
const Mercato = { template: '<div>Mercato</div>' }
const Carrello = { template: '<div>Carrello</div>' }
const Account = { template: '<account-login></account-login>' }
const Altro = { template: '<div>Altro</div>' }


//dichiarazione routes per vue-router
//struttura array di oggetti

const routes = [
  { path: '/Home', component: Home },
  { path: '/Mercato', component: Mercato },
  { path: '/Carrello', component: Carrello },
  { path: '/Account', component: Account },
  { path: '/Altro', component: Altro },
  {path:'/', component: Home}
]




//Inizializzazione istanza VueRouter

const router = new VueRouter({
  routes				//importazione array di oggetti routes

});



//inizializzazione istanza Vue

const vue = new Vue({
	el: '#app',		//id elemento connesso al foglio html
  router				//importazione istanza VueRouter
});


