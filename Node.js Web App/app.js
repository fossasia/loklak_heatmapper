// DEPENDENCIES
var express       = require('express'),
    cookieParser  = require('cookie-parser'),
    bodyParser    = require('body-parser'),
    session       = require('express-session'),
    passport      = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    mongoose      = require('mongoose'),
    bcrypt        = require('bcrypt'),
    flash         = require('connect-flash');

var app = express();

// USERS DATABASE CONNECTION
mongoose.connect(/* YOUR_MONGODB_DATABASE */, function(err) {
  if(err) { // Something went wrong
    throw err;
  }

  console.log(' > Connected to the user database at MongoLab');
});

// SETUP
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'GOOGLEcodein2015',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.set('views', __dirname);
app.set('view engine', 'jade');

var userSchema =  new mongoose.Schema({
  user: String,
  realName: String,
  email: String,
  passHash: String
});

/*
 * generateHash(password, callback)
 *  Creates a hash for the entered password, using the bcrypt algorythm.
 *
 *  @param password {string} Password to hash.
 *  @param callback {function} Function called after the execution. Any possible
 *         error is passed as the first argument, and the generated hash as the
 *         second one.
 */
userSchema.methods.generateHash = function(password, callback) {
    bcrypt.genSalt(10, function(err, salt) {
    	bcrypt.hash(password, salt, callback);
    });
};

/*
 * validatePassword(password, callback)
 *  Checks if the entered password's bcrypt hash matches the user's.
 *
 *  @param password {string} Password to check.
 *  @param callback {function} Function called after the execution. Any possible
 *         error is passed as the first argument, and the result (true if both
 *         hashes are the same, or false if they're not) as the second one.
 */
userSchema.methods.validatePassword = function(password, callback) {
    bcrypt.compare(password, this.passHash, callback);
};

var User = mongoose.model('User', userSchema);  // Creation of the model from the schema

// PASSPORT
// Serialization/Deserialization
passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		done(err, user);
	});
});

// Strategies
passport.use('local-signup', new LocalStrategy({  // Registering a new user
		passReqToCallback: true
	},
	function(req, username, password, done) {
		User.findOne({ 'user': username }, function(err, user) {	// Check if that username already exists
			if(err) { 	// Something went wrong
				throw err;
			}

			if(user) {	// That username already exists
				return done(null, false, req.flash('error', 'Already existing username.'));
			}

			User.findOne({ 'email': req.body.email }, function(err, user) {	// Check if that email address already exists
				if(err) { 	// Something went wrong
					throw err;
				}

				if(user) {	// That email already exists
					return done(null, false, req.flash('error', 'Already existing email.'));
				}

				// Creation of the new user
				var newUser = new User();

				newUser.user = username;
				newUser.realName = req.body.realName;
				newUser.email = req.body.email;
				newUser.generateHash(password, function(err, hash) {
					if(err) { 	// Something went wrong
						throw err;
					}

					newUser.passHash = hash;

					// Save the new user in the database
					newUser.save(function(err) {
						if(err) { 	// Something went wrong
							throw err;
						}

						return done(null, newUser);
					});
				});
			});
		});
	}
));

passport.use('local-login', new LocalStrategy({ // Already existing user logon
		passReqToCallback: true
	},
	function(req, username, password, done) {
		User.findOne({ 'user': username }, function(err, user) {
			if(err) { 	// Something went wrong
				throw err;
			}

			if(!user) {	// That username doesn't exist
				return done(null, false, req.flash('error', 'Incorrect username.'));
			}

			user.validatePassword(password, function(err, res) {	// Password validation
				if(err) { 	// Something went wrong
					throw err;
				}

				if(!res) {
					return done(null, false, req.flash('error', 'Incorrect password.'));
				}

				return done(null, user);
			});
		});
	}
));

// ROUTING
app.get('/', function(req, res) {
  res.redirect('/login');
});

app.get('/register', function(req, res) {
  res.render('register', { errorMessage: req.flash('error') });
});

app.post('/register', passport.authenticate('local-signup', {
			successRedirect: '/profile',
			failureRedirect: '/register',
			failureFlash: true
}));

app.get('/login', function(req, res) {
  res.render('login', { errorMessage: req.flash('error') });
});

app.post('/login', passport.authenticate('local-login', {
			successRedirect: '/profile',
			failureRedirect: '/login',
			failureFlash: true
}));

app.get('/profile', function(req, res) {
  res.render('profile', { user: req.user });
});

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

/*
 * isLoggedIn(req, res, next)
 *  Checks if the user is currently logged in. If not, he/she's redirected to
 *  the login page.
 *
 *  @param req {object} Request.
 *  @param res {object} Response.
 *	@param next {function} Function called if the user is logged on.
 */
function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}

    res.redirect('/login');
}

// SERVER INSTANCE
app.listen(8080, function() {
  console.log('--------------------------------');
  console.log(' Server running at port 8080...')
  console.log('--------------------------------');
});
