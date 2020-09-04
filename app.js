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
	</div>`

})

Vue.component('nav-bar',{
	template: `
<div>

	<div class="top-bar-container">
		<div class="top-nav-bar primary">
			<div class="left-float">
				<ul>
					<li><a href="#" @click="toggle"><i class="material-icons" style="position: relative;top: 3px;left: 5px">menu</i></a></li>
					<li><router-link class="hidden" to="/" style="font-family: 'Indie Flower', cursive;font-size:25px">Il Gomitolo</router-link></li>
				</ul>
			</div>
			<div class="right-float">
				<li><a class="hidden" @click="registerControl">Registrati!</a></li>
				<li><a class="login-nav-bar hidden" @click="loginControl">Accedi</a></li>
			</div>
		</div>
	</div>
	
	<login-card v-if="loginStatus" v-on:closeThis="loginControl" v-on:toRegister="swapAccountRegister"></login-card>
	<register-card v-if="registerStatus" v-on:closeMe="registerControl" v-on:toAccount="swapAccountRegister"></register-card>

	<div id="shadow-for-overlays" v-bind:class="[behindStatus ? 'fade-in' : 'fade-out']">
	<div id="clicker" v-if="behindStatus" @click="clicker"></div>
	</div>
	
	

		
	<div id="sidebar-menu" v-bind:class="[sidebarStatus ? 'menu-sandwitch-active' : 'menu-sandwitch-inactive']">
		  <div class="sidebar-head primary">
				  <img class="sidebar-account-image" src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png" alt="">
		  </div>

						<div class="sidebar-body-wrapper">
							<ul>
								<router-link to="/"><li @click="toggle"><i class="material-icons drawer-li">home</i><h1>Home</h1></li></router-link>
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
			behindStatus: false,
			loginStatus: false,
			registerStatus: false
		}
	},
methods : {
	toggle: function (){
		this.sidebarStatus = true
		this.behindStatus = true
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
	clicker: function (){
		this.behindStatus = false
		this.sidebarStatus = false
		this.loginStatus = false
		this.registerStatus = false
	},
	passSearch: function(){
		console.log(this.search)
		router.push({name :'home', params:{query: this.search}})
	},
	loginControl: function(){
		this.behindStatus = !this.behindStatus
		this.loginStatus = !this.loginStatus
	},
	registerControl: function(){
		this.behindStatus = !this.behindStatus
		this.registerStatus = !this.registerStatus
	},
	swapAccountRegister: function (){
		this.registerStatus = !this.registerStatus
		this.loginStatus = !this.loginStatus
	}
}
});

Vue.component('main-app', {
  template:`
  	<div>
		<div class="search-bar-main-container">
			<div :class="bckgrnSwap ? 'search-bar-main-wrapper-active' : 'search-bar-main-wrapper-inactive'">
				<span class="material-icons search-ico">
					search
				</span>
				<span class="search-bar-inner-container">
					<label v-if="labelControl" class="search-label"><h4>CERCA QUI...</h4></label>
					<input type="text" v-model='search' v-on:keyup="control" class="search-input" v-on:focus="bckgrnSwapControl" v-on:blur="bckgrnSwapControl">
				</span>
			</div>
			
		</div>
		
		
		<filter-snack></filter-snack>
		<div class="products-card-container">
			<card v-for="product in filteredList" :item="product" v-if="!notLoaded"></card>
			<fake-card v-for="fake in fakes" v-if="notLoaded"></fake-card>
		</div>
	</div>`,
	data: function (){
		return {
			products : [],													//	array di oggetti
			search: '',
			labelControl: true,
			bckgrnSwap: false,
			fakes : 20,
			notLoaded : true
		}
	},

	created: function (){
		setTimeout( () =>{
			this.getProducts()
		}, 500);
		
	},
	methods: {
		getProducts : function(){
			var self = this;												//	scope this
			db.collection("products")
			.get()															//	promise
			.then(function(e){												//	puntatore interno
				let data = []												//	array di oggetti
				e.forEach(function(doc) {									//	ciclo su puntatore
					data.push(doc.data()) 
					});		
			self.products = data;
			self.notLoaded = !self.notLoaded
			});
		},
		control: function(){
			this.search === '' ? this.labelControl = true : this.labelControl = false
		},
		bckgrnSwapControl: function(){
			this.bckgrnSwap = !this.bckgrnSwap
		}
	},
	computed:{
		filteredList(){
			return this.products.filter(product =>{
				return product.titolo.toLowerCase().includes(this.search.toLowerCase())
		})
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
			this.isPreferred = !this.isPreferred
			var self = this

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

Vue.component('register-card',{
	template:`
	<div class="login-container">
		<div class="login-clear-button">
			<span class="material-icons" v-on:click="closeSelf">
				clear
			</span>
		</div>
		<div class="login-title"><h1>Inserisci i tuoi dati!</h1></div>	
			<form class="form-container">
				<div class="auth-text-container">
					<transition name="fade">
						<div v-if="userStatus">
							<h4>Username</h4>
						</div>
					</transition>
					<input class="input-field" type="text" name="username" placeholder="Username" v-on:focus="userControl" v-on:blur="userControl" required v-model="username">
				</div>
				<div class="auth-text-container">
					<transition name="fade">
						<div v-if="emailStatus">
							<h4>Email</h4>
						</div>
					</transition>
					<input class="input-field" type="email" name="email" placeholder="Email" v-on:focus="emailControl" v-on:blur="emailControl" required v-model="email">
				</div>
				<div class="auth-text-container">
					<transition name="fade">
						<div v-if="pswStatus">
							<h4>Password</h4>
						</div>
					</transition>
					<input class="input-field" type="password" name="password" placeholder="Password" v-on:focus="pswControl" v-on:blur="pswControl" required v-model="password">
				</div>
				<div class="login-footer">
					<div class="register-text">
						<a href="#" v-on:click="swap"><h2>Hai già un account? Clicca qui!</h2></a>
					</div>
					<button class="login-button ripple" type="submit" v-on:click="registerAccount">
						<h1>Registrati</h1>
					</button>
				</div>
			</form>
		</div>
	</div>`,
	data: function (){
		return{
			username:"",
			email: "",
			password: "",
			pswStatus : false,
			userStatus : false,
			emailStatus: false
		}
	},
	methods:{
		pswControl: function (){
			this.pswStatus = !this.pswStatus
		},
		userControl: function (){
			this.userStatus = !this.userStatus
		},
		emailControl: function (){
			this.emailStatus = !this.emailStatus
		},
		closeSelf: function (){
			this.$emit('closeMe')
		},
		swap: function (){
			this.$emit('toAccount')
		},
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
			this.$emit('closeMe')
			}
				
		}
	  }
	  
})

Vue.component('login-card',{
	template:`
	<div class="login-container">
        <div class="login-clear-button">
            <span class="material-icons" v-on:click="closeSelf">
                clear
            </span>
		</div>
		<div class="login-title"><h1>Inserisci i tuoi dati!</h1></div>	
			<form class="form-container">
				<div class="auth-text-container">
					<transition name="fade">
						<div v-if="userStatus">
							<h4>Email</h4>
						</div>
					</transition>
					<input class="input-field" type="email" name="email" placeholder="Email" v-on:focus="userControl" v-on:blur="userControl" required v-model="email">
				</div>
				<div class="auth-text-container">
					<transition name="fade">
						<div v-if="pswStatus">
							<h4>Password</h4>
						</div>
					</transition>
					<input class="input-field" type="password" name="password" placeholder="Password" v-on:focus="pswControl" v-on:blur="pswControl" required v-model="password">
				</div>
			    <div class="login-footer">
					<div class="register-text">
						<a href="#" v-on:click="swap"><h2>Non hai un account? Clicca qui!</h2></a>
					</div>
                    <button class="login-button ripple" type="submit" v-on:click="loginAccount">
                        <h1>Login</h1>
					</button>
				</div>
            </form>
		</div>
  	</div>`,
	  data: function (){
		  return {
			  email: "",
			  password: "",
			  pswStatus : false,
			  userStatus : false
		  }
	  },
	  methods:{
		pswControl: function (){
			this.pswStatus = !this.pswStatus
		},
		userControl: function (){
			this.userStatus = !this.userStatus
		},
		closeSelf: function (){
			this.$emit('closeThis')
		},
		swap: function (){
			this.$emit('toRegister')
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
				this.$emit('closeThis')          
			}
		}
	  }

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

Vue.component('fake-card',{
	template:`<div class="card-container-fake">
	<div class="background-masker card-top-fake"></div>
	
	<div class="background-masker card-subtitle-fake"></div>

	<div class="background-masker card-image-fake"></div>

	<div class="card-bottom-fake">
		<span class="background-masker bottom-parts-fake"></span>
		<span class="background-masker bottom-parts-fake"></span>
		<span class="background-masker bottom-parts-fake"></span>
		<span class="background-masker bottom-parts-fake"></span>   
	</div>
</div>`
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
  {path:'/Home/:query', component: home, props:true, name:'home'},
  { path: '/ordini', component: ordini },
  { path: '/preferiti', component: preferiti },
  { path: '/areaPersonale', component: areaPersonale },
  { path: '/supporto', component: supporto },
  {path:'/', component: home}
]




//Inizializzazione istanza VueRouter

const router = new VueRouter({
  routes					//importazione array di oggetti routes

});



//inizializzazione istanza Vue

const vue = new Vue({
	el: '#app',				//id elemento connesso al foglio html
  router					//importazione istanza VueRouter
});


