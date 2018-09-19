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
marked.setOptions({
  highlight: (code, lang) => hljs.highlight(lang, code).value,
  smartypants: true
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
  var [toss, top, body] = fs.readFileSync(path, 'utf8')
  .split('---');

    console.log(top, body)
    
  var post = {html: marked(body)}
  top.split('\n').forEach(line => {
    var [key, val] = line.split(/: (.+)/)
    post[key] = val
  })

  return post
}

const postsForIndexing = posts.map(d=>Object.assign({}, d));
const searchIndex = JSON.stringify(postsForIndexing.map(ensureDescription));
fs.writeFileSync(public + '/searchIndex.json', searchIndex);

function ensureDescription(post){
    const regexForTagsEtc = /<\s*script[^>]*>[\s\S]*?(<\s*\/script[^>]*>|$)|&#(\d+);|<[^>]+>|\\n/gi;

    if(!post.hasOwnProperty('desc')) {
        let cleanText = post.html.replace(regexForTagsEtc, '').replace(/\s\s+/g, ' ');
        post.desc = shorten(cleanText, 400);
    }

    delete post.html;
    delete post.template;

    return post;

    // Shorten a string to less than maxLen characters without truncating words.
    function shorten(str, maxLen, separator = ' ') {
        if (str.length <= maxLen) return str;
        return str.substr(0, str.lastIndexOf(separator, maxLen));
    }
}


// console.log(JSON.stringify(posts).replace(regexForTagsEtc, '').replace(/\s\s+/g, ' '))


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