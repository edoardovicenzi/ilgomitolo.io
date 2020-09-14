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
					<li style="cursor:pointer" @click="toggle"><i class="material-icons" style="position: relative;top: 3px;left: 5px">menu</i></li>
					<li><router-link class="hidden" to="/" style="font-family: 'Indie Flower', cursive;font-size:25px">Il Gomitolo</router-link></li>
				</ul>
			</div>
			<div class="right-float">
				<ul>
					<li v-if="!isLogged"><a class="register-nav-bar hidden ripple" @click="registerControl">Registrati</a></li>
				<li v-if="!isLogged"><a class="login-nav-bar hidden" @click="loginControl">Accedi</a></li>
				<li v-if="isLogged"><a class="login-nav-bar" @click="signOut">Signout</a></li>
				<li v-if="!isLogged"class="shown">
					<span class="material-icons" style="color:white">
						account_circle
					</span>
					<div class="dropdown-menu-account">
						<h2 @click="loginControl">Accedi</h2>
						<h2 @click="registerControl">Registrati</h2>
					</div>
				</li>
				</ul>
				
			</div>
		</div>
	</div>
	
	<login-card v-if="loginStatus" v-on:closeThis="loginControl" v-on:toRegister="swapAccountRegister" v-on:isLogged="accountCheck"></login-card>
	<register-card v-if="registerStatus" v-on:closeMe="registerControl" v-on:toAccount="swapAccountRegister" v-on:isRegistered="accountCheck"></register-card>

	<div id="shadow-for-overlays" v-bind:class="[behindStatus ? 'fade-in' : 'fade-out']" @click="clicker">
	</div>
	
	

		
	<div id="sidebar-menu" v-bind:class="[sidebarStatus ? 'menu-sandwitch-active' : 'menu-sandwitch-inactive']">
		<div class="sidebar-head primary">
				<div v-if="isLogged" class="sidebar-head-isLogged">
					<div class="sidebar-image-container">
						<img class="sidebar-account-image" src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png">
					</div>
					
					<div style="margin: auto; float: right;"> 
						<h1 class="sidebar-name">Bentornato</h1>
					</div>
				</div>
				
				<div v-if="!isLogged" style="width: 100%;">
					<h2 style="text-align: center; line-height: 112px;">Effettua il login per scoprire tutte le modalità!</h2>
				</div>
		</div>
			  <div class="sidebar-body-wrapper">
				  <ul>
					  <li class="sidebar-divider"><h2>Servizi</h2></li>
					  <router-link to="/"><li @click="toggle"><i class="material-icons drawer-li">home</i><h1>Home</h1></li></router-link>
					  <router-link to="/scontati"><li @click="toggle"><div><i class="material-icons drawer-li">local_offer</i><h1>Sconti</h1></div></li></router-link>
					  <li class="sidebar-divider"><h2>Le mie liste</h2></li>
					  <router-link to="/ordini"><li @click="toggle"><i class="material-icons drawer-li">list</i><h1>I miei ordini</h1></li></router-link>
					  <router-link to="/preferiti"><li @click="preferiti"><div><i class="material-icons drawer-li">favorite</i><h1>I miei preferiti</h1></div></li></router-link>
					  <li class="sidebar-divider"><h2>Amministrazione</h2></li>
					  <!--<router-link to="/areaPersonale"><li @click="toggle"><div><i class="material-icons drawer-li">person</i><h1>Area personale</h1></div></li></router-link>-->
					  <router-link to="/supporto"><li @click="toggle"><div><i class="material-icons drawer-li">help</i><h1>Supporto</h1></div></li></router-link>
				  </ul>
			  </div>
	</div>
</div>`,
	data: function () {
		return {
			isLogged: false,
			sidebarStatus: false,
			behindStatus: false,
			loginStatus: false,
			registerStatus: false
		}
	},
	created: function (){
		this.accountCheck()
	},
	methods : {
		toggle: function (){
			this.sidebarStatus = !this.sidebarStatus
			this.behindStatus = !this.behindStatus
			},
		preferiti: function(){
			var self = this
			this.sidebarStatus = !this.sidebarStatus
			this.behindStatus = !this.behindStatus
			firebase.auth().onAuthStateChanged(user =>{
				if (!user){														// se esiste un user loggato
					self.$router.go({name: home})
			}
			})
			
		},
		clicker: function (){
			this.behindStatus = false
			this.sidebarStatus = false
			this.loginStatus = false
			this.registerStatus = false
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
		},
		accountCheck: function(){
			var self = this
			firebase.auth().onAuthStateChanged(user =>{
				if (user){
					this.isLogged = true
					this.clicker()
				}
				else{
					this.isLogged = false
				}
			})
		},
		signOut: function(){
			firebase.auth().signOut().then(function() {
				this.isLogged = false
			}).catch(function(error) {
				// An error happened.
			});
		}
	}
});

Vue.component('main-app', {
  template:`
  	<div class="main-app-wrapper">
		<search-bar v-on:searchThis="search"></search-bar>
		<filter-snack></filter-snack>
		<div class="products-card-container">
			<card v-for="product in filteredList" :item="product" v-if="!notLoaded"></card>
			<fake-card v-for="fake in fakes" v-if="notLoaded"></fake-card>
		</div>
	</div>`,
	data: function (){
		return {
			products : [],													//	array di oggetti
			searchItem: '',
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
			.then(function(snap){											//	puntatore interno
				let data = []												//	array di oggetti
				snap.forEach((doc) =>{										//	ciclo su puntatore
					data.push(doc.data()) 
					});		
				self.products = data;
				self.notLoaded = !self.notLoaded
			})
			
			firebase.auth().onAuthStateChanged(user =>{
				if (user){
					db.collection('users').doc(user.uid).collection('preferiti').get()
					.then(snap => {
						snap.forEach(doc => {
							let data = []
							data.push(doc.data())
							for (let i=0; i < data.length; i++){
								for (let j=0; j < self.products.length; j++) {
									if (data[i].id == self.products[j].id){
										self.products[j].isPreferred = true
									}
								}
							}
						})
					})
				}
			})
			
		},
		search: function(event){
			this.searchItem = event
		}
	},
	computed:{
		filteredList(){
			return this.products.filter(product =>{
				return product.titolo.toLowerCase().includes(this.searchItem.toLowerCase())
		})
		}
	}		
});

Vue.component('preferiti',{
	template:`
	<div class="main-app-wrapper">
		<search-bar v-on:searchThis="search"></search-bar>
		<div v-if="isEmpty">
			<img class="preferred-empty-image" src="https://image.flaticon.com/icons/svg/1380/1380641.svg">
			<div class="preferred-empty-title"><h1>La tua lista è vuota! Prova ad aggiungere qualche prodotto...</h1></div>
		</div>
		<div class="products-card-container">
			<preferitiCard v-for="preferiti in filteredList" :item="preferiti" v-on:checkPreferiti="checkIfEmpty"></preferitiCard>
		</div>
	</div>`,
	data: function (){
		return{
			searchItem:'',
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
			firebase.auth().onAuthStateChanged(function(user) {
				if (user) {
					db.collection('users').doc(user.uid).collection('preferiti')
					.get()
					.then(snap => {
						if (snap.empty){
							self.isEmpty = true
						}
						else{
							self.isEmpty = false
							snap.forEach(doc => {
							self.preferitiList.push(doc.data())
						})
						}
					})
				}
			});
		},
		search: function(event){
			this.searchItem = event
		},
		checkIfEmpty(event){
			var self = this
			for (let i=0; i < this.preferitiList.length; i++){
				if (self.preferitiList[i].id == event){
					self.preferitiList.splice(i,1)
				}
			}
			if (this.preferitiList.length == 0){
				this.isEmpty = true
			}
			else{
				this.isEmpty = false
			}
		}
	},
	computed:{
		filteredList(){
			return this.preferitiList.filter(product =>{
				return product.titolo.toLowerCase().includes(this.searchItem.toLowerCase())				
			})
		}
	}

})

Vue.component('discounted',{
	template:`
	<div class="main-app-wrapper">
		<search-bar v-on:searchThis="search"></search-bar>
		<div v-if="isEmpty">
			<div class="preferred-empty-title"><h1>Attualmente non ci sono Sconti!</h1></div>
		</div>
		<div class="products-card-container">
			<card v-for="scontato in filteredList" :item="scontato"></card>
		</div>
	</div>`,
	data: function (){
		return{
			discountedList : [],													//	array di oggetti
			searchItem: '',
			isEmpty: false
		}
	},
	created (){
		this.getScontati()
	},
	methods:{
		getScontati (){
			var self = this;
			console.log('ok')
				db.collection("products")
				.where("isDiscounted", "==", true)
				.get()
				.then(snap => {
					let items =[]
					if (snap.empty){
						console.log('ok')
						self.isEmpty = true
					}
					else{
						console.log('ok')
						self.isEmpty = false
						snap.forEach(doc => {
						items.push(doc.data())
					})
					self.discountedList = items
					}
					firebase.auth().onAuthStateChanged(user =>{
						if (user){
							db.collection('users').doc(user.uid).collection('preferiti').get()
							.then(snap => {
								snap.forEach(doc => {
									let data = []
									data.push(doc.data())
									for (let i=0; i < data.length; i++){
										for (let j=0; j < self.discountedList.length; j++) {
											if (data[i].id == self.discountedList[j].id){
												self.discountedList[j].isPreferred = true
											}
										}
									}
								})
							})
						}
					})
				})
		},
		search: function(event){
			this.searchItem = event
		}
	},
	computed:{
		filteredList(){
			return this.discountedList.filter(product =>{
				return product.titolo.toLowerCase().includes(this.searchItem.toLowerCase())				
			})
		}
	}
})

Vue.component('account-managment',{
	template:`<div>

	</div>
	`,

data: function(){
    return{
    }
},
methods: {

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
				<a v-if="item.isPreferred == false" @click="addToPreferred"><i class="material-icons">favorite_border</i></a>
				<a v-if="item.isPreferred == true" @click="removeToPreferred"><i class="material-icons">favorite</i></a>
				<div class="counter-container">
					<a class="counter-remove"@click="counterRemove"><i class="material-icons">remove</i></a>
					<h4>{{counter}}</h4>
					<a class="counter-add" @click="counterAdd"><i class="material-icons">add</i></a>
				</div>
				<div class="card-buy-button ripple" @click="addToCart">
					<a><h4>Aggiungi</h4></a>
				</div>
		</div>
	</div>`,
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
	},
		addToPreferred: function(){
			this.item.isPreferred = !this.item.isPreferred
			var self = this
			firebase.auth().onAuthStateChanged(function(user) {
				if (user) {
					db.collection('users').doc(user.uid).collection('preferiti').add(self.item)
				}	
			  });		
			
	},
		removeToPreferred: function(){
			this.item.isPreferred = !this.item.isPreferred
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
				}
			  });
			},
		addToCart (){
			var self = this
			var thisId = this.item.id
			if (this.counter != 0){
				firebase.auth().onAuthStateChanged(function(user) {
				if (user) {
					db.collection('users').doc(user.uid).collection('orders').where('product.id', '==', thisId).get()
					.then(snap =>{
						if (snap.empty){
							db.collection('users').doc(user.uid).collection('orders').add({
								quantity : self.counter,
								product : self.item
							})
						}
						else{
							snap.forEach(doc=>{
								count = self.counter + doc.data().quantity
								db.collection('users').doc(user.uid).collection('orders').doc(doc.id).update({
									quantity : count
								})
							})
						}
					})
				}	
				})
				
			}				
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
					<div class="card-buy-button ripple" v-on:click="addToCart">
						<a><h4>Aggiungi</h4></a>
					</div>
		</div>

	</div>`,
	data: function (){
		return {
			 counter: 0,
			 isPreferred: Boolean
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
				}
			  })
			  this.$emit('checkPreferiti', this.item.id)
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
		},
		addToCart (){
			var self = this
			var thisId = this.item.id
			if (this.counter != 0){
				firebase.auth().onAuthStateChanged(function(user) {
				if (user) {
					db.collection('users').doc(user.uid).collection('orders').where('product.id', '==', thisId).get()
					.then(snap =>{
						if (snap.empty){
							db.collection('users').doc(user.uid).collection('orders').add({
								quantity : self.counter,
								product : self.item
							})
						}
						else{
							snap.forEach(doc=>{
								count = self.counter + doc.data().quantity
								db.collection('users').doc(user.uid).collection('orders').doc(doc.id).update({
									quantity : count
								})
							})
						}
					})
				}	
				})
				
			}				
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
			<div class="form-container">
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
					<h2 v-if="error != '' " style="margin:10px auto; color:red;">{{error}}</h2>
				</div>
			</div>
		</div>
	</div>`,
	data: function (){
		return{
			username:"",
			email: "",
			password: "",
			pswStatus : false,
			userStatus : false,
			emailStatus: false,
			error : ''
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
			var self = this
			if (this.email != "" && this.password != "" && this.username != ""){
				firebase.auth().createUserWithEmailAndPassword(this.email, this.password)                        
				.catch(function(error) {
					var errorCode = error.code;
					var errorMessage = error.message;
					console.log(errorCode)
					switch (errorCode) {
						case "auth/weak-password":
							self.error = "La password deve avere almeno 6 caratteri!"
							break;
						case "auth/email-already-in-use":
							self.error = "L'email è già esistente!"
							break;
						default:
							self.error = '';
					}
			  });
			firebase.auth().onAuthStateChanged(user =>{
				if (user){
					db.collection('users').doc(user.uid).set({
						email: this.email,
						username: this.username
					});
				}
			})
			this.$emit('isRegistered')
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
			<div class="form-container">
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
					<h2 v-if="error != ''" style="margin:10px auto; color:red;">{{error}}</h2>
				</div>
            </div>
		</div>
  	</div>`,
	  data: function (){
		  return {
			  email: "",
			  password: "",
			  pswStatus : false,
			  userStatus : false,
			  error : ''
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
			var self = this
			if (this.email != "" && this.password != ""){
				firebase.auth().signInWithEmailAndPassword(this.email, this.password)
				.catch(function(error) {
					// Handle Errors here.
					var errorCode = error.code;
					var errorMessage = error.message;
					console.log(errorCode)
					switch (errorCode) {
						case "auth/wrong-password":
							self.error = "Password errata!"
							break;
						case "auth/user-not-found":
							self.error = "Utente non trovato!"
						default:
							self.error = '';
					}
					
					// ...
				  });
				this.$emit('isLogged')          
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

		<transition name="slide">
		<div v-if="snackStatus" class="filter-list-container">

			<h1 class="filter-category-title">Materiale</h1>
			<div class="checkbox-filter-list">
					<checkbox-filter-component v-for="material in materials" v-bind:materiale="material"></checkbox-filter-component>	
			</div>

			<h1 class="filter-category-title">Misura</h1>
			<div class="checkbox-filter-list">
					<checkbox-filter-component v-for="measure in measures" v-bind:misura="measure"></checkbox-filter-component>
			</div>		
		</div>
		</transition>
	</div>`,
	data: function(){
		return{
			snackStatus: false,
			materials: [],
			measures:[]
		}
	},
	created () {
		this.getAll()
	},
	methods:{
		changeStatus: function(){
			this.snackStatus = !this.snackStatus
		},
		getAll (){
			var self = this;
			db.collection('assets').doc('assets').get()
			.then(doc=>{
				self.materials = doc.data().materiali
				self.measures = doc.data().misure
			})
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

Vue.component('checkbox-filter-component',{
	template:`
	<div>
		<div class="checkbox-active" v-if="isChecked" v-on:click="toggle">
			<span class="material-icons" style="color: white;">
				done
			</span>
		</div>
		<div class="checkbox-inactive" type="button" v-if="!isChecked" v-on:click="toggle"></div>
		<div class="label-for-filter-title">{{ materiale }}{{ misura }}</div>	
	</div>`,
	data: function (){
		return {
			isChecked: false
		}
	},
	methods:{
		toggle (){
			this.isChecked = !this.isChecked
		}
	},
	props:['misura', 'materiale']
})

Vue.component('search-bar',{
	template:`
	<div class="search-bar-main-container">
		<div :class="bckgrnSwap ? 'search-bar-main-wrapper-active' : 'search-bar-main-wrapper-inactive'">
			<span class="material-icons search-ico">
				search
			</span>
			<span class="search-bar-inner-container">
				<label v-if="labelControl" class="search-label"><h4>CERCA QUI...</h4></label>
				<input type="text" v-model='searchbar' v-on:keyup="control" class="search-input" v-on:focus="bckgrnSwapControl" v-on:blur="bckgrnSwapControl">
			</span>
		</div>
	</div>
	`,
	data (){
		return{
			searchbar: '',
			labelControl: true,
			bckgrnSwap: false,
		}
	},
	methods:{
		control: function(){
			this.searchbar === '' ? this.labelControl = true : this.labelControl = false
			this.$emit('searchThis', this.searchbar)
		},
		bckgrnSwapControl: function(){
			this.bckgrnSwap = !this.bckgrnSwap
		}
	}
})

Vue.component('orders',{
	template:`
	<div class="orders-wrapper">
		<div class="orders-list-wrapper">
			<ul class="orders-info-list">
				<li>
					<h1>QNT</h1>
				</li>
				<li class="orders-info-actions">
					<h1>Mod</h1>
				</li>
				<li>
					<h1>Canc</h1>
				</li>
			</ul>
		</div>
		<order-item v-for="order in orders" :ordine="order" v-on:removeMe="updateOrders" :key="order.product.id"></order-item>
		<div class="orders-list-wrapper">
			<ul class="orders-info-list">
				<li class="orders-info-total">
					<h1>Totale</h1>
				</li>
				<li>
					<h1>{{totaleView}}€</h1>
				</li>
			</ul>
		</div>
	</div>`,
	data (){
		return {
			orders : []
		}
	},
	created () {
		this.getOrders()
	},
	methods:{
		getOrders: function (){
			var self = this
			firebase.auth().onAuthStateChanged(user =>{
				if (user){
					db.collection('users').doc(user.uid).collection('orders').get()
					.then(snap=>{
						let data = []
						snap.forEach(doc =>{
							data.push(doc.data())
						})
						self.orders = data
						
					})
				}	
			})
				
		},
		updateOrders (event) {
			for (let i=0; i < this.orders.length; i++){
				if (this.orders[i].product.id == event){
					this.orders.splice(i,1)
				}
			}
		}
		
	},
	computed:{
		totaleView (){
			let sum = 0
			this.orders.forEach(function(item){
				if (item.product.isDiscounted){
					sum = sum +	Math.floor(parseFloat(item.product.prezzoScontato.replace(/,/g, '.')) * item.quantity * 100)/ 100
				}
				else{
					sum = sum + Math.floor(parseFloat(item.product.prezzo.replace(/,/g, '.')) * item.quantity * 100)/ 100
				}
				});
			return sum.toFixed(2).toString().replace(/\./g, ',')
		}
	}
})

Vue.component('order-item',{
	props : ['ordine'],
	template:`
	<div class="orders-list-wrapper" v-if="isOrdered">
		<ul class="orders-info-list">
			<li>
				<h1>{{ ordine.quantity }}x</h1>
			</li>
			<li>
				<h1>{{ ordine.product.titolo }}</h1>
				<h2>{{ ordine.product.misura }}</h2>
			</li>
				
			<li >
				<h1 v-if="ordine.product.isDiscounted">{{ sum }}€</h1>
				<h1 v-if="!ordine.product.isDiscounted">{{ sum }}€</h1>
			</li>
			<li>
				<div class="order-edit" v-on:click="">
					<span class="material-icons" style="width: 24px; height: 24px; margin: auto;">
						edit
					</span>
				</div>
			</li>
			<li>
				<div class="order-remove" v-on:click="removeOrder">
					<span class="material-icons" style="width: 24px; height: 24px; margin: auto;">
						delete
					</span>
				</div>
			</li>
		</ul>
	</div>`,
	data (){
		return {
			sum: 0,
			isOrdered : true
		}
	},
	created (){
		this.getSum()
	},
	methods:{
		getSum (){

			if (this.ordine.product.isDiscounted){
				this.ordine.product.prezzoScontato = this.ordine.product.prezzoScontato.replace(/,/g, '.')							
				//siccome prezzo e prezzoScontato sono una stringa cambio tutte le , con in .
				this.sum = Math.floor(parseFloat(this.ordine.product.prezzoScontato) * this.ordine.quantity * 100) / 100			
				//trasformo la stringa in numero (parseFloat() prende solo i numeri che possono essere convertiti, quindi niente lettere) moltiplico per la quantità poi per 100 e poi tolgo i decimali, infine divido per cento
				this.sum = this.sum.toFixed(2).toString().replace(/\./g, ',')
				//la somma deve avere 2 decimali (toFixed() fa questo), la trasformo in stringa e trasformo ogni . in ,
			}
			else{
				//come sopra ma al posto di "prezzoScontato" abbiamo "prezzo"
				this.ordine.product.prezzo = this.ordine.product.prezzo.replace(/,/g, '.')	
				this.sum = Math.floor(parseFloat(this.ordine.product.prezzo) * this.ordine.quantity * 100) / 100
				this.sum = this.sum.toFixed(2).toString().replace(/\./g, ',')
			}

		},
		removeOrder: function(){
			var self = this
			this.isOrdered = !this.isOrdered;
			var thisId = this.ordine.product.id
			
			firebase.auth().onAuthStateChanged(function(user) {
				if (user) {
					db.collection('users').doc(user.uid).collection('orders').where('product.id', '==', thisId)
					.get()
					.then(snapshot =>{
						snapshot.forEach((doc) => {
							doc.ref.delete();
						})
					})
					self.$emit('removeMe', thisId)
				}
			  });
			}
	}

})

Vue.component('supporto',{
	template:`
	<div class="support-wrapper">
	<ul>
		<li>
			<img src="https://image.flaticon.com/icons/svg/2934/2934394.svg">
			<div>
				<h2 class="hidden">Chiamaci ai nostri numeri sempre attivi, ti forniremo tutte le informazioni di cui hai bisogno. I nostri numeri sempre disponibili</h2>
				<h2>Cellulare: 3456789629  Telefono: 0461 2345717</h2>
			</div>
			
		</li>
		<li>
			<img src="https://image.flaticon.com/icons/svg/860/860809.svg">
			<div>
			<h2>Per ottenere informazioni, inviaci una email all'indirizzo</h2>
			<h2>IlGomitolo.info@gmail.com</h2>
			</div>
		</li>
		<li>
			<img src="https://image.flaticon.com/icons/svg/711/711970.svg">
			<div>
			<h2>Chatta con noi per avere informazioni sui nostri prodotti o sul listino prezzi, contattaci dal tuo smartphone al numero</h2>
			<h2>34567192629</h2>
			</div>
		</li>
		<li>
			<img src="https://image.flaticon.com/icons/svg/953/953810.svg">
			<div>
			<h2>Se il tuo ordine è superiore a 25 euro, la spedizione sarà gratuita; gli ordini arrivano mediamente in 2-5 giorni lavorativi.</h2>
			</div>
		</li>
		<li>
			<img src="https://image.flaticon.com/icons/svg/679/679720.svg">
			<div>
			<h2>Se non sei soddisfatto del tuo ordine puoi rimandarlo indietro, la procedura del reso la trovi sul nostro sito.</h2>
			</div>
		</li>
	</ul>	
	</div>`,

})


//placeholder per VueRouter

const home = { template: '<main-app></main-app>' }
const ordini = { template: '<orders></orders>' }
const preferiti = { template: '<preferiti></preferiti>' }
const areaPersonale = { template: '<account-managment></account-managment>' }
const supporto = { template: '<supporto></supporto>' }
const prodScontati = { template: '<discounted></discounted>' }


//dichiarazione routes per vue-router
//struttura array di oggetti

const routes = [
	{ path: '/scontati', component: prodScontati},
	{ path: '/ordini', component: ordini},
	{ path: '/preferiti', component: preferiti },
	{ path: '/areaPersonale', component: areaPersonale },
	{ path: '/supporto', component: supporto },
	{ path:'/', component: home, name: "home"}
]




//Inizializzazione istanza VueRouter

const router = new VueRouter({
  routes									//importazione array di oggetti routes
});



//inizializzazione istanza Vue

const vue = new Vue({
	el: '#app',								//id elemento connesso al foglio html
  	router									//importazione istanza VueRouter
});
