// use import TOKEN from './token_sample.js and enter your personal token
import TOKEN from './token.js';

// Clear previous session storage
sessionStorage.removeItem('user-profile');

const form = document.querySelector('.form');
const error = document.querySelector('.error');
const errorMessage = document.querySelector('.error__message');
const errorButton = document.querySelector('.error__button');
const username = document.querySelector('.form__input');

const handleSearch = (e) => {
	e.preventDefault();
	if (!username.value) {
		showSearchError('You did not enter a username.');
	} else {
		getUserDataPofile(username.value);
	}
};

form.addEventListener('submit', handleSearch);

const getUserDataPofile = async (username) => {
	const QUERY = {
		query: `
    query { 
      user(login: "${username}") {
        databaseId
        id 
        bio
        avatarUrl
        name
        login
        status {
          emojiHTML
          message
        }
        repositories(first: 20, orderBy: { field: PUSHED_AT, direction: DESC }) {
          totalCount
          edges {
            node {
              id
              name
              pushedAt
              forkCount
              resourcePath
              description
              stargazerCount
              repositoryTopics (first: 5){
                edges {
                  node {
                    url
                    topic {
                      name
                    }
                  }
                }
              }
              primaryLanguage {
                name
                color
              }
            }
          }
        }
      }
    }
    `,
	};

	const postRequestDetails = {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `bearer ${TOKEN}`,
		},
		body: JSON.stringify(QUERY),
		method: 'POST',
	};

	const endpoint = `https://api.github.com/graphql`;
	try {
		const data = await (await fetch(endpoint, postRequestDetails)).json();
		const {
			data: { user },
			errors,
		} = data;

		if (user) {
			sessionStorage.setItem('user-profile', JSON.stringify(user));
			location.assign('/profile.html');
		}
		if (!user && errors.length && errors[0].type === 'NOT_FOUND') {
			throw new Error('user not found');
		}
	} catch (error) {
		showSearchError(error.message);
	}
};

const showSearchError = (message) => {
	errorMessage.textContent = message;
	error.style.display = 'block';
};

const hideSearchError = () => {
	error.style.display = 'none';
	username.value = '';
};

errorButton.addEventListener('click', hideSearchError);
