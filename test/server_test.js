const assert = require("assert")

const pkg = require("./../server.js")

describe("init app state", () => {
	assert.equal(pkg.app._initialized, false)

	pkg.app.init()
	
	assert.equal(Object.keys(pkg.app.locations).length > 0, true)
	assert.equal(pkg.app._initialized, true)
})

