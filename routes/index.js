/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', {
    title: 'ooxx server works on index'
    // title: req.online.length + ' users active'
  })
}

exports.about = function(req, res){
  res.render('about', { title: 'About page' })
}
