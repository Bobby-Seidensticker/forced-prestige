# Makefile for transpiling with Babel in a Node app, or in a client- or
# server-side shared library.

.PHONY: all clean

clean:
	rm -rf lib/*
	rm -f public/scripts/*
	rm -f public/styles/*
	mkdir -p public/scripts public/styles lib/styles

# Install `babel-cli` in a project to get the transpiler.
babel := node_modules/.bin/babel
browserify := node_modules/.bin/browserify

src_js := $(shell find src/ -name '*.js')
src_jsx := $(shell find src/ -name '*.jsx')

# All output js files.  Change .jsx file extensions to .js because browserify is
# stupid and shits itself when it tries to bundle a .jsx file.
transpiled_js := $(patsubst src/%,lib/%,$(src_js)) $(patsubst src/%.jsx,lib/%.js,$(src_jsx))

all_js: $(transpiled_js)

# How to get a transpiled js file from a jsx file
lib/%.js: src/%.jsx
	mkdir -p $(dir $@)
	$(babel) --plugins transform-react-jsx $< --out-file $@ --source-maps

# How to get a transpiled js file from a js file
lib/%.js: src/%.js
	mkdir -p $(dir $@)
	$(babel) --plugins transform-react-jsx $< --out-file $@ --source-maps

public/scripts/bundle.js: $(transpiled_js)
	$(browserify) lib/index.js -s FPG >public/scripts/bundle.js


src_styles := $(shell find src/styles/ -name '*.less')

lib/styles/%.lessc: src/styles/%.less
	mkdir -p $(dir $@)
	lessc -sm=on $< >$@

transpiled_styles := $(patsubst src/styles/%.less,lib/styles/%.lessc,$(src_styles))

public/styles/main.css: $(transpiled_styles)
	${shell cat $(shell find lib/styles/ -name '*.lessc') >$@}

all: public/scripts/bundle.js public/styles/main.css
