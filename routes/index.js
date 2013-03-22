/*
 * GET home page.
 */
exports.welcome = function(req, res){
  res.render('welcome', {
    title: 'welcome'
    // title: req.online.length + ' users active'
  })
}

exports.index = function(req, res){
  res.render('index', {
    title: 'ooxx server works on index'
    // title: req.online.length + ' users active'
  })
}