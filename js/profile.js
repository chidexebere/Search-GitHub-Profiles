const userProfileData = sessionStorage.getItem('user-profile');

const searchWrapper = document.querySelector('.navbar__inputWrapper');
const searchInput = document.querySelector('.navbar__input');
const keySlashIcon = document.querySelector('.key-slash');
const searchAreaNav = document.querySelector('.search-area');

const addSearchFocus = () => {
	keySlashIcon.style.display = 'none';
	searchWrapper.classList.add('focused');
	searchInput.classList.add('input-focused');
};

const removeSearchFocus = () => {
	searchWrapper.classList.remove('focused');
	searchInput.classList.remove('input-focused');
	keySlashIcon.style.display = 'block';
};

const toggleNav = () => {
	searchAreaNav.classList.toggle('open');
};

const openTab = (evt, tab) => {
	let i, tabcontent, tablinks;
	tabcontent = document.getElementsByClassName('tabcontent');
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = 'none';
	}
	tablinks = document.getElementsByClassName('repo-nav__item');
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(' selected', '');
	}
	document.getElementById(tab).style.display = 'block';
	evt.currentTarget.className += ' selected';
};

// Format date
const units = [
	{ name: ' second', value: 1000, max: 50, single: 'a second' },
	{ name: ' minute', value: 60000, max: 50, single: 'a minute' },
	{ name: ' hour', value: 3600000, max: 22, single: 'an hour' },
	{ name: ' day', value: 86400000, max: 6, single: 'a day' },
	{ name: ' week', value: 604800000, max: 3.5, single: 'a week' },
	{ name: ' month', value: 2592000000, max: 11, single: 'a month' },
	{ name: ' year', value: 31536000000, max: Infinity, single: 'a year' },
];

const format = (date) => {
	let diff = Date.now() - date.getTime();

	const future = diff < 0;
	diff = Math.abs(diff);

	if (!future && diff < 10000) return 'just now';
	if (future && diff < 5000) return 'any second';

	const suffix = future ? ' from now' : ' ago';

	for (let i = 0; i < units.length; i++) {
		const unit = units[i];

		if (diff <= unit.max * unit.value) {
			const t = Math.round(diff / unit.value);
			return t === 1 ? unit.single + suffix : t + unit.name + 's' + suffix;
		}
	}
};

/**
 * Generates an SVG element with specified path d
 *
 * @param {String} pathString
 * @param {Object} options
 *
 * @return {Element}
 */
const generateSvgWithPath = (pathString, className, options = {}) => {
	const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	svg.classList.add('icon', className);
	svg.setAttribute('viewBox', options.viewBox ? options.viewBox : '0 0 16 16');
	svg.setAttribute('version', '1.1');
	svg.setAttribute('width', options.width ? options.width : '16');
	svg.setAttribute('height', options.height ? options.height : '16');
	svg.setAttribute('aria-hidden', 'true');

	const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	path.setAttribute('fill-rule', 'evenodd');
	path.setAttribute('d', pathString);
	svg.appendChild(path);
	return svg;
};

const renderRepository = (repository) => {
	const title = document.createElement('h3');
	title.classList.add('repo__title');

	const link = document.createElement('a');
	link.classList.add('repo__title-link');
	link.setAttribute('href', `https://github.com${repository.resourcePath}`);
	link.textContent = repository.name;

	title.append(link);

	const descriptionCover = document.createElement('div');
	descriptionCover.classList.add('repo__description-cover');
	const description = document.createElement('p');
	description.classList.add('repo__description');
	description.textContent = repository.description;
	descriptionCover.append(description);

	// Repository Language
	const language = document.createElement('span');
	language.classList.add('repo__lang');

	const languageColor = document.createElement('span');
	languageColor.classList.add('repo__lang-color');
	languageColor.style.backgroundColor =
		repository.primaryLanguage && repository.primaryLanguage.color;

	const languageName = document.createElement('span');
	languageName.classList.add('repo__lang-text');
	languageName.textContent =
		repository.primaryLanguage && repository.primaryLanguage.name;

	language.append(languageColor, languageName);

	// Star counts
	const starCount = document.createElement('a');
	starCount.classList.add('repo__star-count');
	starCount.setAttribute('href', `#`);

	starCount.append(
		generateSvgWithPath(
			'M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z',
			'icon-star'
		),
		repository.stargazerCount
	);

	// Fork counts
	const forkCount = document.createElement('a');
	forkCount.classList.add('repo__fork-count');

	forkCount.append(
		generateSvgWithPath(
			'M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 ,011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z',
			'icon-repo-forked'
		),
		repository.forkCount
	);

	// Repository time
	const timeUpdated = document.createElement('time');
	timeUpdated.textContent = `${format(new Date(repository.pushedAt))}`;

	const repoDetails = document.createElement('div');
	repoDetails.classList.add('repo__itemDetails');

	if (repository.primaryLanguage) {
		repoDetails.appendChild(language);
	}

	if (repository.stargazerCount) {
		repoDetails.appendChild(starCount);
	}

	if (repository.forkCount) {
		repoDetails.appendChild(forkCount);
	}
	const TEXTUPDATED = document.createTextNode('Updated');
	repoDetails.appendChild(TEXTUPDATED);
	repoDetails.appendChild(timeUpdated);

	const filteredItemDetails = document.createElement('div');
	filteredItemDetails.classList.add('repo__filterItem-details');
	filteredItemDetails.append(title, descriptionCover, repoDetails);

	const starRepo = document.createElement('div');
	starRepo.classList.add('repo__rating');

	const starBtn = document.createElement('button');
	starBtn.classList.add('btn', 'btn-sm');
	starBtn.append(
		generateSvgWithPath(
			'M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z',
			'icon-star'
		),
		'Star'
	);

	starRepo.append(starBtn);

	const filteredItem = document.createElement('li');
	filteredItem.classList.add('repo__filterItem');
	filteredItem.append(filteredItemDetails, starRepo);

	return filteredItem;
};

const populateUserProfilePage = (data) => {
	const avatarImage = document.querySelector('.avatar');
	const dropdownAvatar = document.querySelector('#dropdown-avatar');
	const profileImage = document.querySelector('.profile__img');

	const displayAvatar = (AVATAR) => {
		AVATAR.setAttribute('src', data.avatarUrl);
		AVATAR.setAttribute('alt', `@${data.login}`);
	};

	// Displays avatar in nav in mobile view
	displayAvatar(avatarImage);

	// Displays avatar in top nav in tablet and desktop view
	displayAvatar(dropdownAvatar);

	// Displays profile picture in tablet and desktop view
	displayAvatar(profileImage);

	const userProfileName = document.querySelector('.user-profile-name');
	userProfileName.textContent = data.login;

	const userName = document.querySelector('.username');
	userName.textContent = data.login;

	const userFullName = document.querySelector('.profile__fullname');
	userFullName.textContent = data.name;
	const profileUserFullName = document.querySelector('.profile__username');
	profileUserFullName.textContent = data.login;

	const userEmojiM = document.querySelector('.user-emoji--mobile');
	const defaultEmojiM = document.querySelector('.default-emoji--mobile');
	const statusMsgM = document.querySelector('.user-msg--mobile');
	const userEmojiNav = document.querySelector('.user-emoji--nav');
	const defaultEmojiNav = document.querySelector('.default-emoji--nav');
	const statusMsgNav = document.querySelector('.user-msg--nav');
	const userEmoji = document.querySelector('.user-emoji');
	const defaultEmoji = document.querySelector('.default-emoji');
	const statusMsg = document.querySelector('.user-msg');

	const displayProfileStatus = (USEREMOJI, DEFAULTEMOJI, STATUSMSG) => {
		if (data.status === null) {
			USEREMOJI.style.display = 'none';
			STATUSMSG.innerHTML = 'Set status';
		} else {
			DEFAULTEMOJI.style.display = 'none';
			USEREMOJI.innerHTML = data.status.emojiHTML;
			STATUSMSG.innerHTML = data.status.message;
		}
	};

	// Displays profile status in mobile view
	displayProfileStatus(userEmojiM, defaultEmojiM, statusMsgM);
	// Displays profile status in top nav in tablet and desktop view
	displayProfileStatus(userEmojiNav, defaultEmojiNav, statusMsgNav);
	// Displays profile status in tablet and desktop view
	displayProfileStatus(userEmoji, defaultEmoji, statusMsg);

	const profileStatus = document.querySelector('#profile__status');

	// Toggle profile status in tablet and desktop view
	const showStatusMsg = () => {
		statusMsg.style.display = 'block';
	};
	const hideStatusMsg = () => {
		statusMsg.style.display = 'none';
	};
	profileStatus.addEventListener('mouseover', showStatusMsg);
	profileStatus.addEventListener('mouseout', hideStatusMsg);

	const userBio = document.querySelector('.profile__user-bio');
	userBio.textContent = data.bio;

	const counter = document.querySelector('.counter');
	counter.textContent = data.repositories.totalCount;

	const filteredRepo = document.querySelector('.repo__filterNumber');
	filteredRepo.textContent = data.repositories.edges.length;

	const repositories = data.repositories.edges;

	const fragment = document.createDocumentFragment();
	repositories.forEach(({ node }) => {
		fragment.appendChild(renderRepository(node));
	});

	const filteredList = document.querySelector('.repo__filterList');
	filteredList.append(fragment);
};

console.log(JSON.parse(userProfileData));
populateUserProfilePage(JSON.parse(userProfileData));
