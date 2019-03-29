var fs = require('fs')
var path = require('path');
const yaml = require('js-yaml');
var { exec, execSync } = require('child_process')

var public = `${__dirname}/public`
var source = `${__dirname}/source`

function rsyncSource() {
  exec(`rsync -a --exclude _posts --exclude _templates ${source}/ ${public}/`)
}
rsyncSource()

// var hljs = require('highlight.js')
var marked = require('marked')


//modify marked rendered to output images with links
var renderer = new marked.Renderer();
renderer.image = function (href, title, text) {
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
  // highlight: (code, lang) => hljs.highlight(lang, code).value,
  smartypants: true,
  renderer: renderer
})

var templates = {}
readdirAbs(`${source}/_templates`).forEach(path => {
  var str = fs.readFileSync(path, 'utf8')
  var templateName = path.split('_templates/')[1]
  templates[templateName] = d => eval('`' + str + '`')
})

function readdirAbs(dir) { return fs.readdirSync(dir).map(d => dir + '/' + d) }

var posts = readdirAbs(`${source}/_posts`).map(parsePost)
fs.writeFileSync(public + '/rss.xml', templates['rss.xml'](posts))
fs.writeFileSync(public + '/sitemap.xml', templates['sitemap.xml'](posts))

function parsePost(path) {

  var postArray = fs.readFileSync(path, 'utf8').split('---')
  var top = postArray[1]
  var body = postArray.length > 3 ? postArray.slice(2).join("---") : postArray[2]

  var post = yaml.safeLoad(top);
  // top.split('\n').forEach(line => {
  //   var [key, val] = line.split(/: (.+)/)
  //   post[key] = val
  // })
  post.html = marked(body);

  if (post.hasOwnProperty('author')) {

    const authorArray = cleanCommaDelimited(post.author);

       const authorString = authorArray.length == 1 ? authorArray[0] :
       authorArray.slice(0,-1).join(", ") + " and " + authorArray[authorArray.length - 1];

    post.authorString = authorString;
  }

  if (!post.hasOwnProperty('mainClass')) {
    post.mainClass = "blog"; //default to blog style
  }

  return post
}

//Create thumbnails
const sharp = require('sharp');

posts.forEach(function(post){
  if (post.hasOwnProperty('teaserImage')) {
    //Make new filename with jpg
    const filename = path.parse(post.teaserImage).base.slice(0,-3) + "jpg";
    
    //Set filename in post object so that it can be rendered in the homepage template.
    post.teaserThumbnail = "/images/thumbnails/" + filename;

    // Get file stats for teaserImage and compare modified date to existing thumbnail
    // modified date if there is one. If there is no thumbnail or if the thumbnail's modified
    // date is earlier than the teaserImage's, then create a new thumbmail
    const unprocessedImageStats = fs.statSync(source + post.teaserImage);
    fs.stat(source + "/images/thumbnails/" +  filename, function(err, processedImageStats) {
      if(err || unprocessedImageStats.mtimeMs > processedImageStats.mtimeMs) {
        sharp(source + post.teaserImage).resize(300).toFile(source + "/images/thumbnails/" +  filename)
        .then(()=>{
          fs.copyFile(source + "/images/thumbnails/" +  filename, public + "/images/thumbnails/" +  filename, (err) => {if (err) throw err;});
        })  
      } else {
        // console.log(post.title + " already has a thumbnail.")
      }
    }) 
  } else {
    // console.log(post.title + " is missing teaserImage.")
  }
})

//sharp(source + '/images/posts/supply.png').resize(480).toFile(source + '/images/posts/supply.jpg') 

//Build index
const postsForIndexing = posts.map(d => Object.assign({}, d)).filter(d => !d.hide);
const searchIndex = JSON.stringify(postsForIndexing.map(ensureDescription));
fs.writeFileSync(public + '/searchIndex.json', searchIndex);

function ensureDescription(post) {
  const regexForTagsEtc = /<\s*script[^>]*>[\s\S]*?(<\s*\/script[^>]*>|$)|&#(\d+);|<[^>]+>|\\n/gi;

  if (!post.hasOwnProperty('desc')) {
    let cleanText = post.html.replace(regexForTagsEtc, '').replace(/\s\s+/g, ' ');
    post.desc = shorten(cleanText, 400);
  }

  delete post.html;
  delete post.template;
  delete post.authorString

  return post;

  // Shorten a string to less than maxLen characters without truncating words.
  function shorten(str, maxLen, separator = ' ') {
    if (str.length <= maxLen) return str;
    return str.substr(0, str.lastIndexOf(separator, maxLen));
  }
}


// console.log(JSON.stringify(posts).replace(regexForTagsEtc, '').replace(/\s\s+/g, ' '))
function cleanCommaDelimited(current) {
  let split = current.split(",").map(d => d.trim());

  // if (split.length > 1) {
  //   split[0] = split[0].slice(1);
  //   split[split.length - 1] = split[split.length - 1].slice(0, -1);
  // }

  return split;
}

// Modify index.html to have default posts without js

  const indexStr = fs.readFileSync(`${source}/index.html`, 'utf8')
  const indexTemplate = d => eval('`' + indexStr + '`')

  const liveSearchIndex = JSON.parse(searchIndex).map(function (d) {
    if (d.keywords) d.keywords = cleanCommaDelimited(d.keywords);
    if (d.author) d.author = cleanCommaDelimited(d.author);
    if (d.date) d.date = new Date(d.date); 

    return d;
  })
  const defaultResults = 36;
  const resultsSorted = liveSearchIndex.sort(function (a, b) { return b.date - a.date }).slice(0, defaultResults);
  const searchResultsFormatted = resultsSorted.map(thumbnailTemplate).join('');
  fs.writeFileSync(`${public}/index.html`, indexTemplate(searchResultsFormatted))

  function thumbnailTemplate(d) {
    return `<div class="thumb-wrapper thumb-wrapper-small">
            <a aria-label="${d.title}" href=${d.permalink}>
              <div style="padding-top: 62.5%; background-image: url('${d.teaserThumbnail}'); background-size: cover;"></div>
            </a>
            <div class="thumb-title-wrapper">
              <a class="thumb-title-link" href="${d.permalink}">
                <div title="${d.title}" class="thumb-title">${d.teaserText}</div>
              </a>
            </div>
          </div>`
  }

  //Parse and write posts
var posts = readdirAbs(`${source}/_posts`).map(parsePost)
fs.writeFileSync(public + '/rss.xml', templates['rss.xml'](posts))
fs.writeFileSync(public + '/sitemap.xml', templates['sitemap.xml'](posts))


function writePost(post) {
  var dir = public + post.permalink
  if (!fs.existsSync(dir)) execSync(`mkdir -p ${dir}`)
  fs.writeFileSync(`${dir}/index.html`, templates[post.template](post))
}
posts.forEach(writePost)

if (process.argv.includes('--watch')) {
  require('chokidar').watch(source).on('change', path => {
    rsyncSource()
    if (path.includes('_posts/')) writePost(parsePost(path))
  })
}