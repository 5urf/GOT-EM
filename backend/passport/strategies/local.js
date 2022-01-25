const LocalStrategy = require('passport-local').Strategy;
const { User } = require('../../models');
const hashPassword = require('../../utils/hash-password');

const config = {
  usernameField:'email', 
  passwordField:'password'
};

const local = new LocalStrategy(config,async(email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      done(null,false,{message:'가입되지 않은 회원입니다.'});
      return
    }
    
    if (user.password !== hashPassword(password)) {
      done(null,false,{message:'비밀번호를 다시 확인해주세요'});
      return
    }

    done (null, user);
    return

  } catch (err) {
    done(err);
  } 
});

module.exports = local;

