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
const user = firebase.auth().currentUser;

	



//dichiarazione componenti vue

Vue.component('app-body',{
	template:`<div class="app-body">
		<nav-bar></nav-bar>
		<router-view></router-view>
	</div>`,
	data: function(){
		return {
		}
	},
	methods:{
		getSearchInput: function (value){
			this.passedSearch = value
		}
	}
})

Vue.component('nav-bar',{
	template: `
<div>

	<div class="top-bar-container">
		<div class="top-nav-bar primary">
			<div class="left-float">
				<ul>
					<li><a href="#" @click="toggle()"><i class="material-icons" style="position: relative;top: 3px;left: 5px">menu</i></a></li>
					<li><router-link class="hidden" to="/Home" style="font-family: 'Indie Flower', cursive;font-size:25px">Il Gomitolo</router-link></li>
				</ul>
			</div>
			<div class="right-float">
				<li><a class="hidden">Registrati!</a></li>
				<li><a class="login-nav-bar hidden" @click="toggle()">Log In</a></li>
			</div>
		</div>
	</div>
	
	
	
	<div id="sidebar-menu-shadow" v-bind:class="[behindStatus ? 'fade-in' : 'fade-out']">
	<div id="clicker" v-if="behindStatus" @click="toggle()"></div>
	</div>
	
	

		
	<div id="sidebar-menu" v-bind:class="[sidebarStatus ? 'menu-sandwitch-active' : 'menu-sandwitch-inactive']">
		  <div class="sidebar-head primary">
				  <img class="sidebar-account-image" src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png" alt="">
		  </div>

						<div class="sidebar-body-wrapper">
							<ul>
								<router-link to="/home"><li @click="toggle"><i class="material-icons drawer-li">home</i><h1>Home</h1></li></router-link>
								<router-link to="/ordini"><li @click="toggle"><i class="material-icons drawer-li">list</i><h1>I miei ordini</h1></li></router-link>
								<router-link to="/preferiti"><li @click="preferiti"><div><i class="material-icons drawer-li">favorite</i><h1>I miei preferiti</h1></div></li></router-link>
								<div></div>
								<router-link to="/areaPersonale"><li @click="toggle"><div><i class="material-icons drawer-li">person</i><h1>Area personale</h1></div></li></router-link>
								<router-link to="/supporto"><li @click="toggle"><div><i class="material-icons drawer-li">help</i><h1>Supporto</h1></div></li></router-link>
							</ul>
						</div>				
	</div>
</div>`,
	data: function () {
		return {
			sidebarStatus: false,
			behindStatus: false
		}
	},
methods : {
	toggle: function (){
		this.sidebarStatus = !this.sidebarStatus
		this.behindStatus = !this.behindStatus
		},
	preferiti: function(){
		this.sidebarStatus = !this.sidebarStatus
		this.behindStatus = !this.behindStatus
		firebase.auth().onAuthStateChanged(user =>{
			if (!user){															// se esiste un user loggato
			this.$router.go('home')
			console.log("Non hai effettuato il login!")
		}
		})
		
	},
	passSearch: function(event){
		this.$emit('pass', this.searchInput)
	}
}

});

Vue.component('main-app', {
  template:`
  	<div>
	  	<filter-snack></filter-snack>
		<div class="products-card-container">
			<card v-for="product in products" :item="product"></card>
		</div>
	</div>`,
	data: function (){
		return {
			products : {},												//	array di oggetti
		}
	},

	created: function (){
		this.getProducts()
	},

	methods: {
		getProducts : function(){
			var self = this;												//	scope this
			db.collection("products")
			.get()															//	promise
			.then(function(e){												//	puntatore interno
				let data = {}												//	array di oggetti
				e.forEach(function(doc) {									//	ciclo su puntatore
					data[doc.id] = doc.data()
					});		
			self.products = data;
			});
		}
	}
});

Vue.component('account-managment',{
	template:`<div>
         <div>
			<form>
				<input type="email" placeholder="email" required v-model="email">
				<input type="password" placeholder="password" required v-model="password">
				<button @click="loginAccount">login</button>
			</form>
		</div>
		<button @click="signOut">signout</button>
		<div>
			<form>
				<input type="email" placeholder="email" required v-model="email">
				<input type="password" placeholder="password" required v-model="password">
				<input type="text" placeholder="username" required v-model="username">
				<button type="submit" @click="registerAccount">registrati</button>
			</form> 
		</div>   
    </div>`,

data: function(){
    return{
        email: "",
        password: "",
		username: "",
		usernameID: []
    }
},
methods: {
    registerAccount: function(){
        
        if (this.email != "" && this.password != "" && this.username != ""){
            firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
            .then( e => {
                db.collection('users').add({
                    email: this.email,
                    preferiti: [],
                    username: this.username
                });
            }                               
            )
            .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
            console.log("C'è stato un problema")
		  });
		  
        }
        else{
            console.log('I campi non possono essere vuoti')
        }

            
    },

    loginAccount: function(){
        if (this.email != "" && this.password != ""){
			firebase.auth().signInWithEmailAndPassword(this.email, this.password)
			.catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log('email o password errate')
                // ...
			  });
			  document.cookie = "email="+ firebase.auth().currentUser.email
                  	console.log(document.cookie)             
		}
		else{
			console.log("I campi non possono essere vuoti!")
		}
        

    },
    signOut: function(){
        firebase.auth().signOut().then(function() {
			document.cookie = "email="
			console.log(document.cookie)
          }).catch(function(error) {
            // An error happened.
          });
    }
        }
});

Vue.component('preferiti',{
	template:`<div class="products-card-container">
		<div v-if="isEmpty"><h2>La lista è vuota!</h2></div>
		<preferitiCard v-for="preferiti in preferitiList" :item="preferiti"></preferitiCard>
	</div>`,
	data: function (){
		return{
			preferitiList: [],
			isEmpty: false
		}
	},
	created: function(){
		this.getPreferiti()
		},
	methods:{
		getPreferiti: function(){
			var self = this;
			this.preferitiList = []
			firebase.auth().onAuthStateChanged(function(user) {
				if (user) {
					db.collection('users').doc(user.uid).collection('preferiti')
					.get()
					.then(snap => {
						let items = []
						if (snap.empty){
							self.isEmpty = true
						}
						else{
							self.isEmpty = false
							snap.forEach(doc => {
							items.push(doc.data())
						})
						self.preferitiList = items
						}
						
					})
				}
			  });
		}
	}

})

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
	data: function (){
		return {
			 counter: 0,
			 isPreferred: false,
			 productID: [],
			 userPreferiti: []
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
			this.isPreferred = !this.isPreferred
			var self = this
			var thisId = self.item.id
			var thisRef = ""

			firebase.auth().onAuthStateChanged(function(user) {
				if (user) {
					db.collection('users').doc(user.uid).collection('preferiti').add(self.item)
				}
				db.collection("users").doc(user.uid).collection('preferiti')
				.get()
				.then(snap =>{
					snap.forEach(doc=>{
						db.collection("users").doc(user.uid).collection('preferiti').doc(doc.id)
						.update({
							isPreferred : true
						}) 
					})
				})
				
					
			  });		
			
	},
		removeToPreferred: function(){
			this.isPreferred = !this.isPreferred;
			var self = this;
			var thisId = this.item.id
			
			firebase.auth().onAuthStateChanged(function(user) {
				if (user) {
					db.collection('users').doc(user.uid).collection('preferiti').where('id', '==', thisId)
					.get()
					.then(snapshot =>{
						snapshot.forEach(doc => {
							doc.ref.delete();
						})
					})
				} else {
					alert("non hai effettuato il login!")
				}
			  });
			}
},
	props: ['item']
});

Vue.component('preferitiCard',{
	template:`<div v-if="isPreferred" class="card-container">
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
				<a v-if="isPreferred == false"><i class="material-icons">favorite_border</i></a>
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
	data: function (){
		return {
			 counter: 0,
			 isPreferred: Boolean,
			 productID: "",
			 userPreferiti: []
		 }
	},
	created: function (){
		this.getStatus()
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
		removeToPreferred: function(){
			this.isPreferred = !this.isPreferred;
			var thisId = this.item.id
			
			firebase.auth().onAuthStateChanged(function(user) {
				if (user) {
					db.collection('users').doc(user.uid).collection('preferiti').where('id', '==', thisId)
					.get()
					.then(snapshot =>{
						snapshot.forEach(doc => {
							doc.ref.delete();
						})
					})
				} else {
					alert("non hai effettuato il login!")
				}
			  });
			},
		getStatus: function(){
			var self = this;
			var thisId = this.item.id
			firebase.auth().onAuthStateChanged(function(user) {
				if (user) {
					db.collection('users').doc(user.uid).collection('preferiti').where('id', '==', thisId)
					.get()
					.then(snapshot =>{
						let stat = Boolean			
						snapshot.forEach(doc => {			
							stat = doc.data().isPreferred
						})
						self.isPreferred = stat		
					})
				}
			})
	}
},
	props: ['item']
});

Vue.component('login-card',{
	template:`
	<div class="login-container">
		<div class="login-title"><h1>Inserisci i tuoi dati!</h1></div>
			<div class="login-form">
				<form class="form-container">
					<div class="auth-text-container">
						<div class="test">
							<h1>Email</h1>
						</div>
						<input class="input-field" type="text" name="email" type="email" placeholder="Email">
					</div>
					<div class="auth-text-container">
						<div class="test">
							<h1>Password</h1>
						</div>
						<input class="input-field" type="password" name="password" placeholder="Password">
					</div>
				</form>
			</div>
				<div class="login-footer">
					<div class="register-text">
						<a href="#"><h2>Non hai un account? Clicca qui!</h2></a>
					</div>
				<a href="#"><div class="button">
					<h1>Login</h1>
			</div></a>
		</div>
  	</div>`,

})

Vue.component('filter-snack',{
	template:`
	<div class="filter">
			<div class="filter-snack-container ripple" @click="changeStatus">
				<i class="material-icons">filter_list</i>
				<span>
					<h2 class="filterTitle">FILTRA</h2>
				</span>
			</div>
		
		<div v-if="snackStatus" class="filter-list-container">
			<div class="filter-button"><h2>Test</h2></div>
			<div class="filter-button"><h2>Test</h2></div>
			<div class="filter-button"><h2>Test</h2></div>
			<div class="filter-button"><h2>Test</h2></div>
		</div>
	</div>`,
	data: function(){
		return{
			snackStatus: false
		}
	},
	methods:{
		changeStatus: function(){
			this.snackStatus = !this.snackStatus

		}
	}
})

//placeholder per VueRouter

const home = { template: '<main-app></main-app>' }
const ordini = { template: '<div>ordini</div>' }
const preferiti = { template: '<preferiti></preferiti>' }
const areaPersonale = { template: '<account-managment></account-managment>' }
const supporto = { template: '<div>Supporto</div>' }


//dichiarazione routes per vue-router
//struttura array di oggetti

const routes = [
  { path: '/home', component: home},
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
	el: '#app',
			//id elemento connesso al foglio html
  router				//importazione istanza VueRouter
});


