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
        <form>
        <input type="email" placeholder="email" v-model="email">
        <input type="password" placeholder="password" v-model="password">
        <input type="text" placeholder="username" v-model="username">
        <button @click="testlogin">login</button>
        <button @click="test">registrati</button>
    </form>
        
        
    </div>`,
data: function(){
    return{
        email:this.email,
        password: this.password,
        username: ""
    }
},
methods: {
    test: function(){
        firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
        .then(
            db.collection('users').add({
                email: this.email,
                username:this.username,
                preferiti: []
            }).then(
                document.cookie = "email=" + this.email + "; isLoggedIn=true;"
                )

            
        )
        .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            alert("C'è stato un errore durante la registrazione dell'account!");
            console.log(errorCode, errorMessage)
            document.cookie = "email=;"
            console.log(document.cookie)
          });
    },





    testlogin: function(){
        firebase.auth().signInWithEmailAndPassword(this.email, this.password)
        
        .then(
            document.cookie = "email=" + this.email +"; isLoggedIn=true;"
        )        
        .catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode, errorMessage)
            alert("L'account non esiste o c'è stato un errore!")
            document.cookie = "email=;"
            console.log(document.cookie)
          });

          
    },
    showCookies:function() {
        alert(document.cookie)
    }
}
});
Vue.component('account-register',{
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
				<a v-if="isPreferred == false" @click="addToPreferred"><i class="material-icons">favorite_border</i></a>
				<a v-if="isPreferred == true" @click="removeToPreferred"><i class="material-icons">favorite</i></a>
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
			 counter: 0,
			 isPreferred: false
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
	},
		addToPreferred: function(){

			var ca = decodeURIComponent(document.cookie).split(';');
			for(var i = 0; i <ca.length; i++) {
			  var c = ca[i];
			  while (c.charAt(0) == ' ') {
				c = c.substring(1);
			  }
			  if (c.indexOf('isLoggedIn=') == 0) {
				let h = c.substring('isLoggedIn='.length, c.length);
				if (h === 'true'){
					c.substring('email='.length, c.length)

				this.isPreferred = !this.isPreferred;

			}
			  }
			}
			alert('Per aggiungere alla lista dei preferiti devi aver effettuato il login!');	
			
	},
		removeToPreferred: function(){
			this.isPreferred = !this.isPreferred;
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
					<li><a href="#" @click="toggle()"><i class="material-icons" style="position: relative;top: 3px;left: 5px">menu</i></a></li>
					<li><router-link class="router-link" to="/Home" style="font-family: 'Indie Flower', cursive;font-size:25px">Il Gomitolo</router-link></li>
					<li><router-link to="/Altro">Go to Altro</router-link></li>
				</ul>
			</div>
			<div class="right-float">
				<li><a>Register</a></li>
				<li><a class="login-nav-bar">Log In</a></li>
			</div>
		</div>
	</div>
	
	
	
	<div id="sidebar-menu-shadow" v-bind:class="[sidebarStatus ? 'fade-in' : 'fade-out']">
	<div id="clicker" v-if="sidebarStatus" @click="toggle()"></div>
	</div>
	
	

		
	<div id="sidebar-menu" v-bind:class="[sidebarStatus ? 'menu-sandwitch-active' : 'menu-sandwitch-inactive']">
		  <div class="sidebar-head primary">
			  
				  <img class="sidebar-account-image" src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png" alt="">			  <div>

			  </div>
		  </div>
		  		
						<div class="sidebar-body-wrapper">
							<ul>
								<router-link to="/home"><li @click="toggle"><i class="material-icons drawer-li">home</i><h1>Home</h1></li></router-link>
								<router-link to="/ordini"><li @click="toggle"><i class="material-icons drawer-li">list</i><h1>I miei ordini</h1></li></router-link>
								<router-link to="/preferiti"><li @click="toggle"><div><i class="material-icons drawer-li">favorite</i><h1>I miei preferiti</h1></div></li></router-link>
								<div></div>
								<router-link to="/areaPersonale"><li @click="toggle"><div><i class="material-icons drawer-li">person</i><h1>Area personale</h1></div></li></router-link>
								<router-link to="/supporto"><li @click="toggle"><div><i class="material-icons drawer-li">help</i><h1>Supporto</h1></div></li></router-link>
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

const home = { template: '<app-body></app-body>' }
const ordini = { template: '<div>ordini</div>' }
const preferiti = { template: '<div>preferiti</div>' }
const areaPersonale = { template: '<account-login></account-login>' }
const supporto = { template: '<div>Supporto</div>' }


//dichiarazione routes per vue-router
//struttura array di oggetti

const routes = [
  { path: '/home', component: home },
  { path: '/ordini', component: ordini },
  { path: '/preferiti', component: preferiti },
  { path: '/areaPersonale', component: areaPersonale },
  { path: '/supporto', component: supporto },
  {path:'/', component: home}
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


