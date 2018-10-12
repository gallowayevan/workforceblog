var fs = require('fs')
var {exec, execSync} = require('child_process')

var public = `${__dirname}/public`
var source = `${__dirname}/source`

function rsyncSource(){
  exec(`rsync -a --exclude _posts --exclude _templates ${source}/ ${public}/`)
}
rsyncSource()

var hljs = require('highlight.js')
var marked = require('marked')

//modify marked rendered to output images with links
var renderer = new marked.Renderer();
renderer.image = function(href, title, text) {
  if (this.options.baseUrl && !originIndependentUrl.test(href)) {
    href = resolveUrl(this.options.baseUrl, href);
  }
  var out = '<a href="' + href + '"> <img src="' + href + '" alt="' + text + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += this.options.xhtml ? '/></a>' : '></a>';
  return out;
};

marked.setOptions({
  highlight: (code, lang) => hljs.highlight(lang, code).value,
  smartypants: true,
  renderer: renderer
})

var templates = {}
readdirAbs(`${source}/_templates`).forEach(path => {
  var str = fs.readFileSync(path, 'utf8')
  var templateName = path.split('_templates/')[1]
  templates[templateName] = d => eval('`' + str + '`')
})

function readdirAbs(dir){ return fs.readdirSync(dir).map(d => dir + '/' + d) }

var posts = readdirAbs(`${source}/_posts`).map(parsePost)
fs.writeFileSync(public + '/rss.xml',  templates['rss.xml'](posts))
fs.writeFileSync(public + '/sitemap.xml', templates['sitemap.xml'](posts))

function parsePost(path){
  // var [top, body] = fs.readFileSync(path, 'utf8')
  //   .replace('---\n', '') //needed to add carriage return \r
  //   .split('\n---\n');
  // var [toss, top, body] = fs.readFileSync(path, 'utf8')
  // .split('---');

  var postArray = fs.readFileSync(path, 'utf8').split('---')
  var top = postArray[1]
  var body = postArray.length > 3 ? postArray.slice(2).join("---") : postArray[2]
    
  var post = {html: marked(body)}
  top.split('\n').forEach(line => {
    var [key, val] = line.split(/: (.+)/)
    post[key] = val
  })

  if(!post.hasOwnProperty('mainClass')) {
    post.mainClass = "blog"; //default to blog style
}

  return post
}

function writePost(post){
  var dir = public + post.permalink
  if (!fs.existsSync(dir)) execSync(`mkdir -p ${dir}`)
  fs.writeFileSync(`${dir}/index.html`, templates[post.template](post))
}
posts.forEach(writePost)

if (process.argv.includes('--watch')){
  require('chokidar').watch(source).on('change', path => {
    rsyncSource()
    if (path.includes('_posts/')) writePost(parsePost(path))
  })
}