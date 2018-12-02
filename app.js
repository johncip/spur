function randomItem(arr) {
  const rIndex = Math.floor(Math.random() * arr.length);
  return arr[rIndex];
}

function populate(record) {
  // quote
  const quoteDiv = document.getElementById('quote');
  quoteDiv.textContent = record['quote'];

  // author
  document.getElementById('author').textContent = record['author'];

  // category
  document.getElementById('category').textContent = record['category'];

  // url
  const aTag = document.createElement('a');
  aTag.setAttribute('href', record['url']);
  aTag.innerHTML = record['url'];
  document.getElementById('url').append(aTag);
}

const corpus = [
	{
		quote: 'People who are unable to motivate themselves must be content with mediocrity, no matter how impressive their other talents.',
    	author: 'Andrew Carnegie',
		category: 'Mindset',
		url: 'https://www.brainyquote.com/quotes/andrew_carnegie_391523',
	},
  {
    quote: 'The average person puts only 25% of his energy and ability into his work. The world takes off its hat to those who put in more than 50% of their capacity, and stands on its head for those few and far between souls who devote 100%.',
    author: 'Andrew Carnegie',
    category: 'Mindset',
    url: 'https://hear.ceoblognation.com/2012/10/16/the-men-who-built-america-andrew-carnegie/',
  },
  {
    quote: 'The man who acquires the ability to take full possession of his own mind may take possession of anything else to which he is justly entitled.',
    author: 'Andrew Carnegie',
    category: 'Mindset',
    url: 'https://hear.ceoblognation.com/2012/10/16/the-men-who-built-america-andrew-carnegie/',
  },
  {
    quote: '...People will tell you to do what makes you happy, but a lot of this has been hard work, and I’m not always happy. And I don’t think you should do just what makes you happy. I think you should do what makes you great. Do what’s uncomfortable, and scary, and hard, but pays off in the long run.',
    author: 'Charlie Day',
    category: 'Mindset',
    url: 'https://motivationmentalist.com/2016/12/15/do-what-makes-you-great-charlie-day-motivational-video/',
    size: '32px',
  },
  {
    quote: "Success isn't always about \"greatness\", it's about consistency. Consistent hard work gains success. Greatness will come.",
    author: 'Dwayne "The Rock" Johnson',
    category: 'Mindset',
    url: 'https://twitter.com/therock/status/548846125529055232',
    size: '40px',
  },
  {
    quote: 'Everybody pities the weak; jealousy you have to earn.',
    author: 'Arnold Schwarzenegger',
    category: 'Mindset',
    url: 'https://www.goodreads.com/quotes/152890-everybody-pities-the-weak-jealousy-you-have-to-earn',
  },
  {
    quote: "You'll never change your life until you change something you do daily. The secret of your success is found in your daily routine.",
    author: 'John C. Maxwell',
    category: 'Mindset',
    url: 'https://www.johnmaxwell.com/blog/it-all-comes-down-to-what-you-do-daily/',
  },
  {
    quote: "...If we’re facing in the right direction, all we have to do is keep on walking.",
    author: 'Joseph Goldstein',
    category: 'Mindset',
    url: 'https://fakebuddhaquotes.com/if-we-are-facing-in-the-right-direction-all-we-have-to-do-is-keep-on-walking/',
  },
  {
    quote: "Argue for your limitations and, sure enough, they're yours.",
    author: 'Richard Bach',
    category: 'Mindset',
    url: 'https://www.goodreads.com/quotes/5832-argue-for-your-limitations-and-sure-enough-they-re-yours',
  },
  {
    quote: "Losers spend way too much time being pissed off by the problem rather than moving into the positive state of mind and getting on with building the solution... Losers tell made up stories to themselves and those around them about the problem. This storytelling takes up a lot of time and sucks away all the energy that could be channeled into coming up with the solution.",
    author: 'Tim Denning',
    category: 'Mindset',
    url: 'https://addicted2success.com/success-advice/how-losers-are-created-and-how-to-avoid-becoming-one/'
  }
];

populate(randomItem(corpus));
// populate(corpus[corpus.length - 1]);