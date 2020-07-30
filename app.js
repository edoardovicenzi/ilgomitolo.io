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
const arrayRemove = firebase.firestore.FieldValue.arrayRemove;
const arrayUnion = firebase.firestore.FieldValue.arrayUnion;
const user = firebase.auth().currentUser;


//dichiarazione componenti vue


Vue.component('app-body', {
  template:`
	<div class="products-card-container">
	<card v-for="product in products" :item="product"></card>
  </div>`,
	data: function (){
		return {
			products : []													//	array di oggetti
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
				let Ids = [];												//	array di oggetti
				e.forEach(function(doc) {									//	ciclo su puntatore
					Ids.push(doc.data())
					});
			self.products = Ids;
			});
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
				<li><a class="login-nav-bar" @click="toggle()">Log In</a></li>
			</div>
		</div>
	</div>
	
	
	
	<div id="sidebar-menu-shadow" v-bind:class="[behindStatus ? 'fade-in' : 'fade-out']">
	<div id="clicker" v-if="behindStatus" @click="toggle()"></div>
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
			cookie: "",
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
		if (!user){															// se esiste un user loggato
			console.log("Non hai effettuato il login!")
			this.$router.go('home')
		}
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
		<card v-for="preferiti in IDpreferiti" :item="preferiti"></card>
	</div>`,
	data: function (){
		return{
			IDpreferiti: [],
			cookie: ""
		}
	},
	created: function(){
		this.getPreferiti()
		},
	methods:{
		getPreferiti: function(){
			var self = this;
			var cookie = ""
			for(let i=0; i < document.cookie.length; i++){
				if (document.cookie.charAt(i) === "="){
					for (let j=i+1; j < document.cookie.length;j++){
						cookie = cookie + document.cookie.charAt(j)
					}
				}
			}
			db.collection('users').where("email", "==", cookie)
				.get()
				.then(snapshot =>{
					let ids = []
					if (snapshot.empty){
					}
					else{
						snapshot.docs.forEach(doc=>{
							ids.push(doc.data());
						})
						for (let i=0; i < ids[0].preferiti.length; i++){
							db.collection('products').doc(ids[0].preferiti[i])
							.get()
							.then(doc =>{
								self.IDpreferiti.push(doc.data())
							})
						}
					}
				})
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
	props: ['item'],
	data: function (){
		return {
			 counter: 0,
			 isPreferred: false,
			 userID: []
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
			this.isPreferred = !this.isPreferred;
			var self = this;
			if (user){															//	se esiste un user loggato
				
				db.collection("users").where("email", "==", user.email).get() 	//	query su email per accedere a user ID
				.then(function(e){
					let userIDD = []
					e.forEach(function (doc) {
						userIDD.push(doc.id);
					});
					console.log(userIDD)
					self.userID = userIDD;
				})
				.catch(
					console.log("errore")
				)
				console.log(this.userID)
				db.collection("users").doc(toString(self.userID[0])).update({					//	cambia il campo
					preferiti: arrayUnion(self.item.id)							//	rimuovi
				})
			}
			else{
				alert('Per aggiungere alla lista dei preferiti devi aver effettuato il login!')
				this.isPreferred = !this.isPreferred;
			}
			
	},
		removeToPreferred: function(){
			this.isPreferred = !this.isPreferred;
			var user = firebase.auth().currentUser;
			var self = this;
			if (user){															//	se esiste un user loggato
				db.collection("users").where("email", "==", user.email).get() 	//	query su email per accedere a user ID
				.then(snapshot =>{
					let userIDD = []
					snapshot.forEach(doc =>{
						userIDD.push(doc.id)
					});
					self.userID = userIDD;
				})
				.catch(
					console.log("errore")
				)
				db.collection("users").doc(self.userID[0].toString()).update({					// 	cambia il campo
					preferiti: arrayRemove(self.item.id)						//	rimuovi
				})
			}
			else{
				alert('Per aggiungere alla lista dei preferiti devi aver effettuato il login!')
				this.isPreferred = !this.isPreferred;
			}
	}
}
});

Vue.component('login-card',{
	template:`<div class="login-container">
	<div class="login-title"><h1>Inserisci i tuoi dati!</h1></div>
	<div class="login-form">
	  <form class="form-container">
		<div class="auth-text-container">
		  <div class="test"><h1>Email</h1></div>
		  <input class="input-field" type="text" name="email" type="email" placeholder="Email">
		</div>
		<div class="auth-text-container">
		  <div class="test"><h1>Password</h1></div>
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
  </div>`
})
//placeholder per VueRouter

const home = { template: '<app-body></app-body>' }
const ordini = { template: '<div>ordini</div>' }
const preferiti = { template: '<preferiti></preferiti>' }
const areaPersonale = { template: '<account-managment></account-managment>' }
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
	el: '#app',
			//id elemento connesso al foglio html
  router				//importazione istanza VueRouter
});


