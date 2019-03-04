# angular-lazy-routes-fix

[![npm version](https://img.shields.io/npm/v/@phenomnomnominal/angular-lazy-routes-fix.svg)](https://img.shields.io/npm/v/@phenomnomnominal/angular-lazy-routes-fix.svg)
[![Code Climate](https://codeclimate.com/github/phenomnomnominal/angular-lazy-routes-fix/badges/gpa.svg)](https://codeclimate.com/github/phenomnomnominal/angular-lazy-routes-fix)
[![Test Coverage](https://codeclimate.com/github/phenomnomnominal/angular-lazy-routes-fix/coverage.svg)](https://codeclimate.com/github/phenomnomnominal/tsquery/angular-lazy-routes-fix)

## Installation

```sh
npm install @phenomnomnominal/angular-lazy-routes-fix --save-dev
```

Update your tslint.json file to extend this package:

```json
{
  "extends": [
    "@phenomnomnominal/angular-lazy-routes-fix"
  ],
  "rules": {
    "no-lazy-module-paths": [true],
    "//": "or",
    "no-lazy-module-paths": [true, "async"]
  }
}
```
