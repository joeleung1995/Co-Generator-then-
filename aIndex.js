let fs = require('fs')

function read (path) {
	return new Promise((resolve, reject) => {
		fs.readFile(path, 'utf-8', (err, data) => {
			if (data) {
				resolve(data)
			} else {
				reject(err)
			}
		})
	})
}

// 常见的链式调用
	// read('./first.txt')
	// .then((res) => {
	// 	return read(res)
	// })
	// .then((res) => {
	// 	return read(res)
	// })
	// .then((res) => {
	// 	console.log(res)
	// })

// 待优化版本，需要解决层级嵌套调用的问题
	// function * gen () {
	// 	let secondPath = yield read('./first.txt')
	// 	let thirdPath = yield read(secondPath)
	// 	let result = yield read(thirdPath)
	// 	return result
	// }

	// let genIns = gen()
	// genIns.next().value.then((res) => {
	// 	genIns.next(res).value.then(res => {
	// 		genIns.next(res).value.then(res => {
	// 			console.log(res)
	// 		})
	// 	})
	// })

// 通过递归解决层级嵌套的问题（Co库的原理）
	function * gen () {
		let secondPath = yield read('./first.txt')
		let thirdPath = yield read(secondPath)
		let result = yield read(thirdPath)
		return result
	}

	function Co (genIns) {
		return new Promise((resolve, reject) => {
			let next = (data) => {
				let {value, done} = genIns.next(data)
				if (done) {
					resolve(value)
				} else {
					value.then(res => {
						next(res)
					})
				}
			}
			next()
		})
	}

	Co(gen()).then(res => {
		console.log(res)
	})