async function getDashboardData(url = './data.json') {
	const response = await fetch(url)
	const data = await response.json()

	return data
}

class DashboardItem {
	static PERIODS = {
		daily: 'day',
		weekly: 'week',
		monthly: 'month',
	}

	constructor(data, container = '.dashboard__content', view = 'weekly') {
		this.data = data
		this.container = document.querySelector(container)
		this.view = view

		this.createMarkup()
	}

	createMarkup() {
		const { title, timeframes } = this.data

		const id = title.toLowerCase().replace(/ /g, '-')
		const { current, previous } = timeframes[this.view.toLowerCase()]

		let card = document.createElement('div')
		card.classList.add(`dashboard__item`, `dashboard__item--${id}`)
		card.insertAdjacentHTML(
			'beforeend',
			`
				<article class="tracking-card">
					<header class="tracking-card__header">
						<h3 class="tracking-card__title">${title}</h3>
						<img class="tracking-card__menu" src="./images/icon-ellipsis.svg" alt="Меню выбора" />
					</header>
					<div class="tracking-card__body">
						<div class="tracking-card__time">${current}hrs</div>
						<div class="tracking-card__prev-time">Last ${DashboardItem.PERIODS[this.view]} - ${previous}hrs</div>
					</div>
				</article>
		`,
		)

		this.container.append(card)

		this.time = card.querySelector(`.tracking-card__time`)
		this.prevTime = card.querySelector(`.tracking-card__prev-time`)
	}

	changeView(view) {
		this.view = view.toLowerCase()
		const { current, previous } = this.data.timeframes[this.view.toLowerCase()]

		this.time.innerText = `${current}hrs`
		this.prevTime.innerText = `Last ${DashboardItem.PERIODS[this.view]} - ${previous}hrs`
	}
}

document.addEventListener('DOMContentLoaded', () => {
	getDashboardData().then(data => {
		const activities = data.map(activity => new DashboardItem(activity))

		const selectors = document.querySelectorAll('.view-selector__item')

		selectors.forEach(selector => {
			selector.addEventListener('click', function () {
				selectors.forEach(item => item.classList.remove('view-selector__item--active'))
				selector.classList.add('view-selector__item--active')

				const currentView = selector.innerText.trim().toLowerCase()
				activities.forEach(activity => activity.changeView(currentView))
			})
		})
	})
})
