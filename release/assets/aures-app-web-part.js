define("710fcc7f-4d14-424c-947b-74a2c48623d0_0.0.1", ["@microsoft/sp-property-pane","AuresAppWebPartStrings","@microsoft/sp-core-library","@microsoft/sp-webpart-base","react","react-dom"], function(__WEBPACK_EXTERNAL_MODULE__26ea__, __WEBPACK_EXTERNAL_MODULE_DnXt__, __WEBPACK_EXTERNAL_MODULE_UWqr__, __WEBPACK_EXTERNAL_MODULE_br4S__, __WEBPACK_EXTERNAL_MODULE_cDcd__, __WEBPACK_EXTERNAL_MODULE_faye__) { return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "gATm");
/******/ })
/************************************************************************/
/******/ ({

/***/ "+y5s":
/*!*************************************************************!*\
  !*** ./node_modules/@pnp/queryable/behaviors/cancelable.js ***!
  \*************************************************************/
/*! exports provided: asCancelableScope, cancelableScope, Cancelable, CancelAction */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export asCancelableScope */
/* unused harmony export cancelableScope */
/* unused harmony export Cancelable */
/* unused harmony export CancelAction */
/* harmony import */ var _pnp_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @pnp/core */ "JC1J");

/**
 * Cancelable is a fairly complex behavior as there is a lot to consider through multiple timelines. We have
 * two main cases:
 *
 * 1. basic method that is a single call and returns the result of an operation (return spPost(...))
 * 2. complex method that has multiple async calls within
 *
 * 1. For basic calls the cancel info is attached in init as it is only involved within a single request.
 *    This works because there is only one request and the cancel logic doesn't need to persist across
 *    inheriting instances. Also, many of these requests are so fast canceling is likely unnecessary
 *
 * 2. Complex method present a larger challenge because they are comprised of > 1 request and the promise
 *    that is actually returned to the user is not directly from one of our calls. This promise is the
 *    one "created" by the language when you await. For complex methods we have two things that solve these
 *    needs.
 *
 *    The first is the use of either the cancelableScope decorator or the asCancelableScope method
 *    wrapper. These create an upper level cancel info that is then shared across the child requests within
 *    the complex method. Meaning if I do a files.addChunked the same cancel info (and cancel method)
 *    are set on the current "this" which is user object on which the method was called. This info is then
 *    passed down to any child requests using the original "this" as a base using the construct moment.
 *
 *    The CancelAction behavior is used to apply additional actions to a request once it is canceled. For example
 *    in the case of uploading files chunked in sp we cancel the upload by id.
 */
// this is a special moment used to broadcast when a request is canceled
const MomentName = "__CancelMoment__";
// this value is used to track cancel state and the value is represetented by IScopeInfo
const ScopeId = Symbol.for("CancelScopeId");
// module map of all currently tracked cancel scopes
const cancelScopes = new Map();
/**
 * This method is bound to a scope id and used as the cancel method exposed to the user via cancelable promise
 *
 * @param this unused, the current promise
 * @param scopeId Id bound at creation time
 */
async function cancelPrimitive(scopeId) {
    const scope = cancelScopes.get(scopeId);
    scope.controller.abort();
    if (Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* isArray */ "f"])(scope === null || scope === void 0 ? void 0 : scope.actions)) {
        scope.actions.map(action => scope.currentSelf.on[MomentName](action));
    }
    try {
        await scope.currentSelf.emit[MomentName]();
    }
    catch (e) {
        scope.currentSelf.log(`Error in cancel: ${e}`, 3);
    }
}
/**
 * Creates a new scope id, sets it on the instance's ScopeId property, and adds the info to the map
 *
 * @returns the new scope id (GUID)
 */
function createScope(instance) {
    const id = Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* getGUID */ "d"])();
    instance[ScopeId] = id;
    cancelScopes.set(id, {
        cancel: cancelPrimitive.bind({}, id),
        actions: [],
        controller: null,
        currentSelf: instance,
    });
    return id;
}
/**
 * Function wrapper that turns the supplied function into a cancellation scope
 *
 * @param func Func to wrap
 * @returns The same func signature, wrapped with our cancel scoping logic
 */
const asCancelableScope = (func) => {
    return function (...args) {
        // ensure we have setup "this" to cancel
        // 1. for single requests the value is set in the behavior's init observer
        // 2. for complex requests the value is set here
        if (!Reflect.has(this, ScopeId)) {
            createScope(this);
        }
        // execute the original function, but don't await it
        const result = func.apply(this, args).finally(() => {
            // remove any cancel scope values tied to this instance
            cancelScopes.delete(this[ScopeId]);
            delete this[ScopeId];
        });
        // ensure the synthetic promise from a complex method has a cancel method
        result.cancel = cancelScopes.get(this[ScopeId]).cancel;
        return result;
    };
};
/**
 * Decorator used to mark multi-step methods to ensure all subrequests are properly cancelled
 */
function cancelableScope(_target, _propertyKey, descriptor) {
    // wrapping the original method
    descriptor.value = asCancelableScope(descriptor.value);
}
/**
 * Allows requests to be canceled by the caller by adding a cancel method to the Promise returned by the library
 *
 * @returns Timeline pipe to setup canelability
 */
function Cancelable() {
    if (!AbortController) {
        throw Error("The current environment appears to not support AbortController, please include a suitable polyfill.");
    }
    return (instance) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        instance.on.construct(function (init, path) {
            if (typeof init !== "string") {
                const parent = Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* isArray */ "f"])(init) ? init[0] : init;
                if (Reflect.has(parent, ScopeId)) {
                    // ensure we carry over the scope id to the new instance from the parent
                    this[ScopeId] = parent[ScopeId];
                }
                // define the moment's implementation
                this.moments[MomentName] = Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* asyncBroadcast */ "a"])();
            }
        });
        // init our queryable to support cancellation
        instance.on.init(function () {
            if (!Reflect.has(this, ScopeId)) {
                // ensure we have setup "this" to cancel
                // 1. for single requests this will set the value
                // 2. for complex requests the value is set in asCancelableScope
                const id = createScope(this);
                // if we are creating the scope here, we have not created it within asCancelableScope
                // meaning the finally handler there will not delete the tracked scope reference
                this.on.dispose(() => {
                    cancelScopes.delete(id);
                });
            }
            this.on[this.InternalPromise]((promise) => {
                // when a new promise is created add a cancel method
                promise.cancel = cancelScopes.get(this[ScopeId]).cancel;
                return [promise];
            });
        });
        instance.on.pre(async function (url, init, result) {
            // grab the current scope, update the controller and currentSelf
            const existingScope = cancelScopes.get(this[ScopeId]);
            // if we are here without a scope we are likely running a CancelAction request so we just ignore canceling
            if (Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* objectDefinedNotNull */ "g"])(existingScope)) {
                const controller = new AbortController();
                existingScope.controller = controller;
                existingScope.currentSelf = this;
                if (init.signal) {
                    // we do our best to hook our logic to the existing signal
                    init.signal.addEventListener("abort", () => {
                        existingScope.cancel();
                    });
                }
                else {
                    init.signal = controller.signal;
                }
            }
            return [url, init, result];
        });
        // clean up any cancel info from the object after the request lifecycle is complete
        instance.on.dispose(function () {
            delete this[ScopeId];
            delete this.moments[MomentName];
        });
        return instance;
    };
}
/**
 * Allows you to define an action that is run when a request is cancelled
 *
 * @param action The action to run
 * @returns A timeline pipe used in the request lifecycle
 */
function CancelAction(action) {
    return (instance) => {
        instance.on.pre(async function (...args) {
            const existingScope = cancelScopes.get(this[ScopeId]);
            // if we don't have a scope this request is not using Cancelable so we do nothing
            if (Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* objectDefinedNotNull */ "g"])(existingScope)) {
                if (!Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* isArray */ "f"])(existingScope.actions)) {
                    existingScope.actions = [];
                }
                if (existingScope.actions.indexOf(action) < 0) {
                    existingScope.actions.push(action);
                }
            }
            return args;
        });
        return instance;
    };
}
//# sourceMappingURL=cancelable.js.map

/***/ }),

/***/ "26ea":
/*!**********************************************!*\
  !*** external "@microsoft/sp-property-pane" ***!
  \**********************************************/
/*! no static exports found */
/*! exports used: PropertyPaneTextField */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__26ea__;

/***/ }),

/***/ "39m/":
/*!******************************************!*\
  !*** ./lib/services/MentoringService.js ***!
  \******************************************/
/*! exports provided: MentoringService */
/*! exports used: MentoringService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return MentoringService; });
/* harmony import */ var _pnp_sp_webs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @pnp/sp/webs */ "6k7F");
/* harmony import */ var _pnp_sp_lists__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @pnp/sp/lists */ "J7sA");
/* harmony import */ var _pnp_sp_items__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @pnp/sp/items */ "lYrR");
/* harmony import */ var _interfaces__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./interfaces */ "FFPM");
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};




var LIST_MENTORS = 'Mentors';
var LIST_TALENTS = 'Talents';
var LIST_REQUESTS = 'MentoringRequests';
var MENTOR_SELECT = ['Id', 'Title', 'JobTitle', 'Superpower', 'Bio', 'Capacity', 'AvailabilityNote', 'PhotoUrl', 'IsActive',
    'MentorUser/Id', 'MentorUser/Title', 'MentorUser/EMail'];
var MENTOR_EXPAND = ['MentorUser'];
var TALENT_SELECT = ['Id', 'Title', 'IsActive',
    'TalentUser/Id', 'TalentUser/Title', 'TalentUser/EMail'];
var TALENT_EXPAND = ['TalentUser'];
var REQUEST_SELECT = [
    'Id', 'Title', 'CurrentStage', 'RequestStatus',
    'Message1', 'Message2', 'Message3',
    'Stage1Decision', 'Stage2Decision', 'Stage3Decision',
    'Stage1DecisionDate', 'Stage2DecisionDate', 'Stage3DecisionDate',
    'TalentRef/Id', 'TalentRef/Title',
    'Mentor1Ref/Id', 'Mentor1Ref/Title',
    'Mentor2Ref/Id', 'Mentor2Ref/Title',
    'Mentor3Ref/Id', 'Mentor3Ref/Title',
    'Stage1DecisionBy/Id', 'Stage1DecisionBy/Title', 'Stage1DecisionBy/EMail',
    'Stage2DecisionBy/Id', 'Stage2DecisionBy/Title', 'Stage2DecisionBy/EMail',
    'Stage3DecisionBy/Id', 'Stage3DecisionBy/Title', 'Stage3DecisionBy/EMail'
];
var REQUEST_EXPAND = [
    'TalentRef', 'Mentor1Ref', 'Mentor2Ref', 'Mentor3Ref',
    'Stage1DecisionBy', 'Stage2DecisionBy', 'Stage3DecisionBy'
];
var MentoringService = /** @class */ (function () {
    function MentoringService(_sp) {
        this._sp = _sp;
    }
    // ----------------------------------------------------------------
    // Mentors
    // ----------------------------------------------------------------
    MentoringService.prototype.getMentors = function () {
        return __awaiter(this, void 0, void 0, function () {
            var items;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (_a = (_b = this._sp.web.lists
                            .getByTitle(LIST_MENTORS).items)
                            .select.apply(_b, MENTOR_SELECT))
                            .expand.apply(_a, MENTOR_EXPAND).filter('IsActive eq 1')()];
                    case 1:
                        items = _c.sent();
                        return [2 /*return*/, items];
                }
            });
        });
    };
    MentoringService.prototype.getMentorByEmail = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var items;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (_a = (_b = this._sp.web.lists
                            .getByTitle(LIST_MENTORS).items)
                            .select.apply(_b, MENTOR_SELECT))
                            .expand.apply(_a, MENTOR_EXPAND).filter("MentorUser/EMail eq '".concat(email, "' and IsActive eq 1"))()];
                    case 1:
                        items = _c.sent();
                        return [2 /*return*/, items[0]];
                }
            });
        });
    };
    MentoringService.prototype.getMentorById = function (mentorId) {
        return __awaiter(this, void 0, void 0, function () {
            var item;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (_a = (_b = this._sp.web.lists
                            .getByTitle(LIST_MENTORS).items
                            .getById(mentorId))
                            .select.apply(_b, MENTOR_SELECT))
                            .expand.apply(_a, MENTOR_EXPAND)()];
                    case 1:
                        item = _c.sent();
                        return [2 /*return*/, item];
                }
            });
        });
    };
    MentoringService.prototype.getAllMentorsForAdmin = function () {
        return __awaiter(this, void 0, void 0, function () {
            var items;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (_a = (_b = this._sp.web.lists
                            .getByTitle(LIST_MENTORS).items)
                            .select.apply(_b, MENTOR_SELECT))
                            .expand.apply(_a, MENTOR_EXPAND).orderBy('Title')()];
                    case 1:
                        items = _c.sent();
                        return [2 /*return*/, items];
                }
            });
        });
    };
    // ----------------------------------------------------------------
    // Talents
    // ----------------------------------------------------------------
    MentoringService.prototype.getTalentByEmail = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var items;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (_a = (_b = this._sp.web.lists
                            .getByTitle(LIST_TALENTS).items)
                            .select.apply(_b, TALENT_SELECT))
                            .expand.apply(_a, TALENT_EXPAND).filter("TalentUser/EMail eq '".concat(email, "' and IsActive eq 1"))()];
                    case 1:
                        items = _c.sent();
                        return [2 /*return*/, items[0]];
                }
            });
        });
    };
    MentoringService.prototype.getAllTalents = function () {
        return __awaiter(this, void 0, void 0, function () {
            var items;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (_a = (_b = this._sp.web.lists
                            .getByTitle(LIST_TALENTS).items)
                            .select.apply(_b, TALENT_SELECT))
                            .expand.apply(_a, TALENT_EXPAND).filter('IsActive eq 1')()];
                    case 1:
                        items = _c.sent();
                        return [2 /*return*/, items];
                }
            });
        });
    };
    MentoringService.prototype.getTalentById = function (talentId) {
        return __awaiter(this, void 0, void 0, function () {
            var item;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (_a = (_b = this._sp.web.lists
                            .getByTitle(LIST_TALENTS).items
                            .getById(talentId))
                            .select.apply(_b, TALENT_SELECT))
                            .expand.apply(_a, TALENT_EXPAND)()];
                    case 1:
                        item = _c.sent();
                        return [2 /*return*/, item];
                }
            });
        });
    };
    MentoringService.prototype.getAllTalentsForAdmin = function () {
        return __awaiter(this, void 0, void 0, function () {
            var items;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (_a = (_b = this._sp.web.lists
                            .getByTitle(LIST_TALENTS).items)
                            .select.apply(_b, TALENT_SELECT))
                            .expand.apply(_a, TALENT_EXPAND).orderBy('Title')()];
                    case 1:
                        items = _c.sent();
                        return [2 /*return*/, items];
                }
            });
        });
    };
    // ----------------------------------------------------------------
    // Requests — read
    // ----------------------------------------------------------------
    MentoringService.prototype.getMyRequests = function (talentId) {
        return __awaiter(this, void 0, void 0, function () {
            var items;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (_a = (_b = this._sp.web.lists
                            .getByTitle(LIST_REQUESTS).items)
                            .select.apply(_b, REQUEST_SELECT))
                            .expand.apply(_a, REQUEST_EXPAND).filter("TalentRefId eq ".concat(talentId))
                            .orderBy('Created', false)()];
                    case 1:
                        items = _c.sent();
                        return [2 /*return*/, items];
                }
            });
        });
    };
    MentoringService.prototype.getPendingRequestsForMentor = function (mentorId) {
        return __awaiter(this, void 0, void 0, function () {
            var stageFilter, items;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        stageFilter = [
                            "(Mentor1RefId eq ".concat(mentorId, " and CurrentStage eq 1)"),
                            "(Mentor2RefId eq ".concat(mentorId, " and CurrentStage eq 2)"),
                            "(Mentor3RefId eq ".concat(mentorId, " and CurrentStage eq 3)")
                        ].join(' or ');
                        return [4 /*yield*/, (_a = (_b = this._sp.web.lists
                                .getByTitle(LIST_REQUESTS).items)
                                .select.apply(_b, REQUEST_SELECT))
                                .expand.apply(_a, REQUEST_EXPAND).filter("(".concat(stageFilter, ") and RequestStatus eq 'Pending'"))
                                .orderBy('Created', false)()];
                    case 1:
                        items = _c.sent();
                        return [2 /*return*/, items];
                }
            });
        });
    };
    MentoringService.prototype.getRequestHistoryForMentor = function (mentorId) {
        return __awaiter(this, void 0, void 0, function () {
            var mentorFilter, items;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        mentorFilter = [
                            "Mentor1RefId eq ".concat(mentorId),
                            "Mentor2RefId eq ".concat(mentorId),
                            "Mentor3RefId eq ".concat(mentorId)
                        ].join(' or ');
                        return [4 /*yield*/, (_a = (_b = this._sp.web.lists
                                .getByTitle(LIST_REQUESTS).items)
                                .select.apply(_b, REQUEST_SELECT))
                                .expand.apply(_a, REQUEST_EXPAND).filter("(".concat(mentorFilter, ") and RequestStatus ne 'Pending'"))
                                .orderBy('Modified', false)()];
                    case 1:
                        items = _c.sent();
                        return [2 /*return*/, items];
                }
            });
        });
    };
    MentoringService.prototype.getAllRequests = function () {
        return __awaiter(this, void 0, void 0, function () {
            var items;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (_a = (_b = this._sp.web.lists
                            .getByTitle(LIST_REQUESTS).items)
                            .select.apply(_b, REQUEST_SELECT))
                            .expand.apply(_a, REQUEST_EXPAND).orderBy('Created', false)()];
                    case 1:
                        items = _c.sent();
                        return [2 /*return*/, items];
                }
            });
        });
    };
    MentoringService.prototype.getRequestById = function (requestId) {
        return __awaiter(this, void 0, void 0, function () {
            var item;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (_a = (_b = this._sp.web.lists
                            .getByTitle(LIST_REQUESTS).items
                            .getById(requestId))
                            .select.apply(_b, REQUEST_SELECT))
                            .expand.apply(_a, REQUEST_EXPAND)()];
                    case 1:
                        item = _c.sent();
                        return [2 /*return*/, item];
                }
            });
        });
    };
    // ----------------------------------------------------------------
    // Requests — write
    // ----------------------------------------------------------------
    MentoringService.prototype.submitRequest = function (talentId, mentorIds, messages) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function () {
            var body, result, newId;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        body = {
                            Title: 'REQ-2026-TEMP',
                            TalentRefId: talentId,
                            Mentor1RefId: mentorIds[0],
                            Message1: (_a = messages[0]) !== null && _a !== void 0 ? _a : '',
                            CurrentStage: 1,
                            RequestStatus: _interfaces__WEBPACK_IMPORTED_MODULE_3__[/* RequestStatus */ "e"].Pending
                        };
                        if (mentorIds[1] != null) {
                            body['Mentor2RefId'] = mentorIds[1];
                            body['Message2'] = (_b = messages[1]) !== null && _b !== void 0 ? _b : '';
                        }
                        if (mentorIds[2] != null) {
                            body['Mentor3RefId'] = mentorIds[2];
                            body['Message3'] = (_c = messages[2]) !== null && _c !== void 0 ? _c : '';
                        }
                        return [4 /*yield*/, this._sp.web.lists
                                .getByTitle(LIST_REQUESTS).items.add(body)];
                    case 1:
                        result = _f.sent();
                        newId = (_d = result === null || result === void 0 ? void 0 : result.Id) !== null && _d !== void 0 ? _d : (_e = result === null || result === void 0 ? void 0 : result.data) === null || _e === void 0 ? void 0 : _e.Id;
                        return [4 /*yield*/, this._sp.web.lists
                                .getByTitle(LIST_REQUESTS).items
                                .getById(newId)
                                .update({ Title: "REQ-2026-".concat(newId) })];
                    case 2:
                        _f.sent();
                        return [2 /*return*/, newId];
                }
            });
        });
    };
    /**
     * Zaznamenava rozhodnuti mentora a implementuje fall-through logiku:
     * Approve → RequestStatus = Approved
     * Reject  → posun na dalsiho mentora, nebo HR_Review kdyz nikdo nezbyva
     */
    MentoringService.prototype.makeDecision = function (requestId, stage, decision, decisionById) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var request, decisionDate, update;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.getRequestById(requestId)];
                    case 1:
                        request = _d.sent();
                        decisionDate = new Date().toISOString();
                        update = (_c = {},
                            _c["Stage".concat(stage, "Decision")] = decision,
                            _c["Stage".concat(stage, "DecisionDate")] = decisionDate,
                            _c["Stage".concat(stage, "DecisionById")] = decisionById,
                            _c);
                        if (decision === _interfaces__WEBPACK_IMPORTED_MODULE_3__[/* StageDecision */ "t"].Approved) {
                            update['RequestStatus'] = _interfaces__WEBPACK_IMPORTED_MODULE_3__[/* RequestStatus */ "e"].Approved;
                        }
                        else {
                            // Fall-through: posun na dalsiho mentora nebo HR_Review
                            if (stage === 1 && ((_a = request.Mentor2Ref) === null || _a === void 0 ? void 0 : _a.Id) != null) {
                                update['CurrentStage'] = 2;
                            }
                            else if ((stage === 1 || stage === 2) && ((_b = request.Mentor3Ref) === null || _b === void 0 ? void 0 : _b.Id) != null) {
                                update['CurrentStage'] = 3;
                            }
                            else {
                                update['RequestStatus'] = _interfaces__WEBPACK_IMPORTED_MODULE_3__[/* RequestStatus */ "e"].HR_Review;
                            }
                        }
                        return [4 /*yield*/, this._sp.web.lists
                                .getByTitle(LIST_REQUESTS).items
                                .getById(requestId)
                                .update(update)];
                    case 2:
                        _d.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // ----------------------------------------------------------------
    // HR / Admin — writes
    // ----------------------------------------------------------------
    MentoringService.prototype.updateMentorCapacity = function (mentorId, capacity) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._sp.web.lists
                            .getByTitle(LIST_MENTORS).items
                            .getById(mentorId)
                            .update({ Capacity: capacity })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MentoringService.prototype.setMentorActive = function (mentorId, isActive) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._sp.web.lists
                            .getByTitle(LIST_MENTORS).items
                            .getById(mentorId)
                            .update({ IsActive: isActive })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MentoringService.prototype.setRequestStatus = function (requestId, status) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._sp.web.lists
                            .getByTitle(LIST_REQUESTS).items
                            .getById(requestId)
                            .update({ RequestStatus: status })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MentoringService.prototype.setTalentActive = function (talentId, isActive) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._sp.web.lists
                            .getByTitle(LIST_TALENTS).items
                            .getById(talentId)
                            .update({ IsActive: isActive })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MentoringService.prototype.addMentor = function (data) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this._sp.web.lists
                            .getByTitle(LIST_MENTORS).items.add(__assign(__assign({}, data), { IsActive: true, AvailabilityNote: '' }))];
                    case 1:
                        result = _c.sent();
                        return [2 /*return*/, (_a = result === null || result === void 0 ? void 0 : result.Id) !== null && _a !== void 0 ? _a : (_b = result === null || result === void 0 ? void 0 : result.data) === null || _b === void 0 ? void 0 : _b.Id];
                }
            });
        });
    };
    MentoringService.prototype.updateMentor = function (mentorId, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._sp.web.lists
                            .getByTitle(LIST_MENTORS).items
                            .getById(mentorId)
                            .update(data)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MentoringService.prototype.deleteMentor = function (mentorId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._sp.web.lists
                            .getByTitle(LIST_MENTORS).items
                            .getById(mentorId)
                            .delete()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MentoringService.prototype.deleteRequest = function (requestId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._sp.web.lists
                            .getByTitle(LIST_REQUESTS).items
                            .getById(requestId)
                            .delete()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MentoringService.prototype.cancelAllRequestsForTalent = function (talentId) {
        return __awaiter(this, void 0, void 0, function () {
            var active, _i, active_1, item;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._sp.web.lists
                            .getByTitle(LIST_REQUESTS).items
                            .filter("TalentRefId eq ".concat(talentId, " and (RequestStatus eq 'Pending' or RequestStatus eq 'HR_Review')"))
                            .select('Id')()];
                    case 1:
                        active = _a.sent();
                        _i = 0, active_1 = active;
                        _a.label = 2;
                    case 2:
                        if (!(_i < active_1.length)) return [3 /*break*/, 5];
                        item = active_1[_i];
                        return [4 /*yield*/, this._sp.web.lists
                                .getByTitle(LIST_REQUESTS).items
                                .getById(item.Id)
                                .update({ RequestStatus: _interfaces__WEBPACK_IMPORTED_MODULE_3__[/* RequestStatus */ "e"].Cancelled })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return MentoringService;
}());



/***/ }),

/***/ "3DT9":
/*!*********************************************!*\
  !*** ./node_modules/@pnp/sp/items/types.js ***!
  \*********************************************/
/*! exports provided: _Items, Items, _Item, Item, _ItemVersions, ItemVersions, _ItemVersion, ItemVersion */
/*! exports used: Items */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export _Items */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return Items; });
/* unused harmony export _Item */
/* unused harmony export Item */
/* unused harmony export _ItemVersions */
/* unused harmony export ItemVersions */
/* unused harmony export _ItemVersion */
/* unused harmony export ItemVersion */
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "LVfT");
/* harmony import */ var _spqueryable_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../spqueryable.js */ "F4qD");
/* harmony import */ var _pnp_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @pnp/core */ "JC1J");
/* harmony import */ var _pnp_sp__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @pnp/sp */ "UKGb");
/* harmony import */ var _lists_types_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lists/types.js */ "hy0S");
/* harmony import */ var _pnp_queryable__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @pnp/queryable */ "Ymo3");
/* harmony import */ var _decorators_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../decorators.js */ "hMpi");







/**
 * Describes a collection of Item objects
 *
 */
let _Items = class _Items extends _spqueryable_js__WEBPACK_IMPORTED_MODULE_1__[/* _SPCollection */ "a"] {
    /**
    * Gets an Item by id
    *
    * @param id The integer id of the item to retrieve
    */
    getById(id) {
        return Item(this).concat(`(${id})`);
    }
    /**
     * Gets BCS Item by string id
     *
     * @param stringId The string id of the BCS item to retrieve
     */
    getItemByStringId(stringId) {
        // creates an item with the parent list path and append out method call
        return Item([this, this.parentUrl], `getItemByStringId('${stringId}')`);
    }
    /**
     * Skips the specified number of items (https://msdn.microsoft.com/en-us/library/office/fp142385.aspx#sectionSection6)
     *
     * @param skip The starting id where the page should start, use with top to specify pages
     * @param reverse It true the PagedPrev=true parameter is added allowing backwards navigation in the collection
     */
    skip(skip, reverse = false) {
        if (reverse) {
            this.query.set("$skiptoken", `Paged=TRUE&PagedPrev=TRUE&p_ID=${skip}`);
        }
        else {
            this.query.set("$skiptoken", `Paged=TRUE&p_ID=${skip}`);
        }
        return this;
    }
    [Symbol.asyncIterator]() {
        const nextInit = Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_1__[/* SPCollection */ "e"])(this).using(Object(_pnp_queryable__WEBPACK_IMPORTED_MODULE_5__[/* parseBinderWithErrorCheck */ "m"])(async (r) => {
            const json = await r.json();
            const nextLink = Object(_pnp_core__WEBPACK_IMPORTED_MODULE_2__[/* hOP */ "u"])(json, "d") && Object(_pnp_core__WEBPACK_IMPORTED_MODULE_2__[/* hOP */ "u"])(json.d, "__next") ? json.d.__next : json["odata.nextLink"];
            return {
                hasNext: typeof nextLink === "string" && nextLink.length > 0,
                nextLink,
                value: Object(_pnp_queryable__WEBPACK_IMPORTED_MODULE_5__[/* parseODataJSON */ "_"])(json),
            };
        }));
        const queryParams = ["$top", "$select", "$expand", "$filter", "$orderby", "$skiptoken"];
        for (let i = 0; i < queryParams.length; i++) {
            const param = this.query.get(queryParams[i]);
            if (Object(_pnp_core__WEBPACK_IMPORTED_MODULE_2__[/* objectDefinedNotNull */ "g"])(param)) {
                nextInit.query.set(queryParams[i], param);
            }
        }
        return {
            _next: nextInit,
            async next() {
                if (this._next === null) {
                    return { done: true, value: undefined };
                }
                const result = await this._next();
                if (result.hasNext) {
                    this._next = Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_1__[/* SPCollection */ "e"])([this._next, result.nextLink]);
                    return { done: false, value: result.value };
                }
                else {
                    this._next = null;
                    return { done: false, value: result.value };
                }
            },
        };
    }
    /**
     * Adds a new item to the collection
     *
     * @param properties The new items's properties
     * @param listItemEntityTypeFullName The type name of the list's entities
     */
    async add(properties = {}) {
        return Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_1__[/* spPost */ "d"])(this, Object(_pnp_queryable__WEBPACK_IMPORTED_MODULE_5__[/* body */ "d"])(properties));
    }
};
_Items = Object(tslib__WEBPACK_IMPORTED_MODULE_0__[/* __decorate */ "e"])([
    Object(_decorators_js__WEBPACK_IMPORTED_MODULE_6__[/* defaultPath */ "e"])("items")
], _Items);

const Items = Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_1__[/* spInvokableFactory */ "c"])(_Items);
/**
 * Descrines a single Item instance
 *
 */
class _Item extends _spqueryable_js__WEBPACK_IMPORTED_MODULE_1__[/* _SPInstance */ "i"] {
    constructor() {
        super(...arguments);
        this.delete = Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_1__[/* deleteableWithETag */ "s"])();
    }
    /**
     * Gets the effective base permissions for the item
     *
     */
    get effectiveBasePermissions() {
        return Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_1__[/* SPQueryable */ "n"])(this, "EffectiveBasePermissions");
    }
    /**
     * Gets the effective base permissions for the item in a UI context
     *
     */
    get effectiveBasePermissionsForUI() {
        return Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_1__[/* SPQueryable */ "n"])(this, "EffectiveBasePermissionsForUI");
    }
    /**
     * Gets the field values for this list item in their HTML representation
     *
     */
    get fieldValuesAsHTML() {
        return Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_1__[/* SPInstance */ "t"])(this, "FieldValuesAsHTML");
    }
    /**
     * Gets the field values for this list item in their text representation
     *
     */
    get fieldValuesAsText() {
        return Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_1__[/* SPInstance */ "t"])(this, "FieldValuesAsText");
    }
    /**
     * Gets the field values for this list item for use in editing controls
     *
     */
    get fieldValuesForEdit() {
        return Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_1__[/* SPInstance */ "t"])(this, "FieldValuesForEdit");
    }
    /**
     * Gets the collection of versions associated with this item
     */
    get versions() {
        return ItemVersions(this);
    }
    /**
     * this item's list
     */
    get list() {
        return this.getParent(_lists_types_js__WEBPACK_IMPORTED_MODULE_4__[/* List */ "e"], "", this.parentUrl.substring(0, this.parentUrl.lastIndexOf("/")));
    }
    /**
     * Updates this list instance with the supplied properties
     *
     * @param properties A plain object hash of values to update for the list
     * @param eTag Value used in the IF-Match header, by default "*"
     */
    async update(properties, eTag = "*") {
        const postBody = Object(_pnp_queryable__WEBPACK_IMPORTED_MODULE_5__[/* body */ "d"])(properties, Object(_pnp_queryable__WEBPACK_IMPORTED_MODULE_5__[/* headers */ "f"])({
            "IF-Match": eTag,
            "X-HTTP-Method": "MERGE",
        }));
        return Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_1__[/* spPost */ "d"])(Item(this).using(ItemUpdatedParser()), postBody);
    }
    /**
     * Moves the list item to the Recycle Bin and returns the identifier of the new Recycle Bin item.
     */
    recycle() {
        return Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_1__[/* spPost */ "d"])(Item(this, "recycle"));
    }
    /**
     * Deletes the item object with options.
     *
     * @param parameters Specifies the options to use when deleting a item.
     */
    async deleteWithParams(parameters) {
        return Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_1__[/* spPost */ "d"])(Item(this, "DeleteWithParameters"), Object(_pnp_queryable__WEBPACK_IMPORTED_MODULE_5__[/* body */ "d"])({ parameters }));
    }
    /**
     * Gets a string representation of the full URL to the WOPI frame.
     * If there is no associated WOPI application, or no associated action, an empty string is returned.
     *
     * @param action Display mode: 0: view, 1: edit, 2: mobileView, 3: interactivePreview
     */
    async getWopiFrameUrl(action = 0) {
        const i = Item(this, "getWOPIFrameUrl(@action)");
        i.query.set("@action", action);
        return Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_1__[/* spPost */ "d"])(i);
    }
    /**
     * Validates and sets the values of the specified collection of fields for the list item.
     *
     * @param formValues The fields to change and their new values.
     * @param bNewDocumentUpdate true if the list item is a document being updated after upload; otherwise false.
     */
    validateUpdateListItem(formValues, bNewDocumentUpdate = false) {
        return Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_1__[/* spPost */ "d"])(Item(this, "validateupdatelistitem"), Object(_pnp_queryable__WEBPACK_IMPORTED_MODULE_5__[/* body */ "d"])({ formValues, bNewDocumentUpdate }));
    }
    /**
     * Gets the parent information for this item's list and web
     */
    async getParentInfos() {
        const urlInfo = await this.select("Id", "ParentList/Id", "ParentList/Title", "ParentList/RootFolder/UniqueId", "ParentList/RootFolder/ServerRelativeUrl", "ParentList/RootFolder/ServerRelativePath", "ParentList/ParentWeb/Id", "ParentList/ParentWeb/Url", "ParentList/ParentWeb/ServerRelativeUrl", "ParentList/ParentWeb/ServerRelativePath").expand("ParentList", "ParentList/RootFolder", "ParentList/ParentWeb")();
        return {
            Item: {
                Id: urlInfo.Id,
            },
            ParentList: {
                Id: urlInfo.ParentList.Id,
                Title: urlInfo.ParentList.Title,
                RootFolderServerRelativePath: urlInfo.ParentList.RootFolder.ServerRelativePath,
                RootFolderServerRelativeUrl: urlInfo.ParentList.RootFolder.ServerRelativeUrl,
                RootFolderUniqueId: urlInfo.ParentList.RootFolder.UniqueId,
            },
            ParentWeb: {
                Id: urlInfo.ParentList.ParentWeb.Id,
                ServerRelativePath: urlInfo.ParentList.ParentWeb.ServerRelativePath,
                ServerRelativeUrl: urlInfo.ParentList.ParentWeb.ServerRelativeUrl,
                Url: urlInfo.ParentList.ParentWeb.Url,
            },
        };
    }
    async setImageField(fieldName, imageName, imageContent) {
        const contextInfo = await this.getParentInfos();
        const webUrl = Object(_pnp_sp__WEBPACK_IMPORTED_MODULE_3__[/* extractWebUrl */ "e"])(this.toUrl());
        const q = Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_1__[/* SPQueryable */ "n"])([this, webUrl], "/_api/web/UploadImage");
        q.concat("(listTitle=@a1,imageName=@a2,listId=@a3,itemId=@a4)");
        q.query.set("@a1", `'${contextInfo.ParentList.Title}'`);
        q.query.set("@a2", `'${imageName}'`);
        q.query.set("@a3", `'${contextInfo.ParentList.Id}'`);
        q.query.set("@a4", contextInfo.Item.Id);
        const result = await Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_1__[/* spPost */ "d"])(q, { body: imageContent });
        const itemInfo = {
            "type": "thumbnail",
            "fileName": result.Name,
            "nativeFile": {},
            "fieldName": fieldName,
            "serverUrl": contextInfo.ParentWeb.Url.replace(contextInfo.ParentWeb.ServerRelativeUrl, ""),
            "serverRelativeUrl": result.ServerRelativeUrl,
            "id": result.UniqueId,
        };
        return this.validateUpdateListItem([{
                FieldName: fieldName,
                FieldValue: JSON.stringify(itemInfo),
            }]);
    }
}
const Item = Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_1__[/* spInvokableFactory */ "c"])(_Item);
/**
 * Describes a collection of Version objects
 *
 */
let _ItemVersions = class _ItemVersions extends _spqueryable_js__WEBPACK_IMPORTED_MODULE_1__[/* _SPCollection */ "a"] {
    /**
     * Gets a version by id
     *
     * @param versionId The id of the version to retrieve
     */
    getById(versionId) {
        return ItemVersion(this).concat(`(${versionId})`);
    }
};
_ItemVersions = Object(tslib__WEBPACK_IMPORTED_MODULE_0__[/* __decorate */ "e"])([
    Object(_decorators_js__WEBPACK_IMPORTED_MODULE_6__[/* defaultPath */ "e"])("versions")
], _ItemVersions);

const ItemVersions = Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_1__[/* spInvokableFactory */ "c"])(_ItemVersions);
/**
 * Describes a single Version instance
 *
 */
class _ItemVersion extends _spqueryable_js__WEBPACK_IMPORTED_MODULE_1__[/* _SPInstance */ "i"] {
    constructor() {
        super(...arguments);
        this.delete = Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_1__[/* deleteableWithETag */ "s"])();
    }
}
const ItemVersion = Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_1__[/* spInvokableFactory */ "c"])(_ItemVersion);
function ItemUpdatedParser() {
    return Object(_pnp_queryable__WEBPACK_IMPORTED_MODULE_5__[/* parseBinderWithErrorCheck */ "m"])(async (r) => ({
        etag: r.headers.get("etag"),
    }));
}
//# sourceMappingURL=types.js.map

/***/ }),

/***/ "4kGv":
/*!********************************************!*\
  !*** ./node_modules/@pnp/core/timeline.js ***!
  \********************************************/
/*! exports provided: noInherit, once, Timeline, cloneObserverCollection */
/*! exports used: Timeline, cloneObserverCollection, noInherit */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return noInherit; });
/* unused harmony export once */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return Timeline; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "t", function() { return cloneObserverCollection; });
/* harmony import */ var _moments_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./moments.js */ "DZog");
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util.js */ "NuLX");


/**
 * Field name to hold any flags on observer functions used to modify their behavior
 */
const flags = Symbol.for("ObserverLifecycleFlags");
/**
 * Creates a filter function for use in Array.filter that will filter OUT any observers with the specified [flag]
 *
 * @param flag The flag used to exclude observers
 * @returns An Array.filter function
 */
// eslint-disable-next-line no-bitwise
const byFlag = (flag) => ((observer) => !((observer[flags] || 0) & flag));
/**
 * Creates an observer lifecycle modification flag application function
 * @param flag The flag to the bound function should add
 * @returns A function that can be used to apply [flag] to any valid observer
 */
const addFlag = (flag) => ((observer) => {
    // eslint-disable-next-line no-bitwise
    observer[flags] = (observer[flags] || 0) | flag;
    return observer;
});
/**
 * Observer lifecycle modifier that indicates this observer should NOT be inherited by any child
 * timelines.
 */
const noInherit = addFlag(1 /* ObserverLifecycleFlags.noInherit */);
/**
 * Observer lifecycle modifier that indicates this observer should only fire once per instance, it is then removed.
 *
 * Note: If you have a parent and child timeline "once" will affect both and the observer will fire once for a parent lifecycle
 * and once for a child lifecycle
 */
const once = addFlag(2 /* ObserverLifecycleFlags.once */);
/**
 * Timeline represents a set of operations executed in order of definition,
 * with each moment's behavior controlled by the implementing function
 */
class Timeline {
    /**
     * Creates a new instance of Timeline with the supplied moments and optionally any observers to include
     *
     * @param moments The moment object defining this timeline
     * @param observers Any observers to include (optional)
     */
    constructor(moments, observers = {}) {
        this.moments = moments;
        this.observers = observers;
        this._onProxy = null;
        this._emitProxy = null;
        this._inheritingObservers = true;
    }
    /**
     * Apply the supplied behavior(s) to this timeline
     *
     * @param behaviors One or more behaviors
     * @returns `this` Timeline
     */
    using(...behaviors) {
        for (let i = 0; i < behaviors.length; i++) {
            behaviors[i](this);
        }
        return this;
    }
    /**
     * Property allowing access to manage observers on moments within this timeline
     */
    get on() {
        if (this._onProxy === null) {
            this._onProxy = new Proxy(this, {
                get: (target, p) => Object.assign((handler) => {
                    target.cloneObserversOnChange();
                    addObserver(target.observers, p, handler, 1 /* ObserverAddBehavior.Add */);
                    return target;
                }, {
                    toArray: () => {
                        return Reflect.has(target.observers, p) ? [...Reflect.get(target.observers, p)] : [];
                    },
                    replace: (handler) => {
                        target.cloneObserversOnChange();
                        addObserver(target.observers, p, handler, 3 /* ObserverAddBehavior.Replace */);
                        return target;
                    },
                    prepend: (handler) => {
                        target.cloneObserversOnChange();
                        addObserver(target.observers, p, handler, 2 /* ObserverAddBehavior.Prepend */);
                        return target;
                    },
                    clear: () => {
                        if (Reflect.has(target.observers, p)) {
                            target.cloneObserversOnChange();
                            // we trust ourselves that this will be an array
                            target.observers[p].length = 0;
                            return true;
                        }
                        return false;
                    },
                }),
            });
        }
        return this._onProxy;
    }
    /**
     * Shorthand method to emit a logging event tied to this timeline
     *
     * @param message The message to log
     * @param level The level at which the message applies
     */
    log(message, level = 0) {
        this.emit.log(message, level);
    }
    /**
     * Shorthand method to emit an error event tied to this timeline
     *
     * @param e Optional. Any error object to emit. If none is provided no emit occurs
     */
    error(e) {
        if (Object(_util_js__WEBPACK_IMPORTED_MODULE_1__[/* objectDefinedNotNull */ "l"])(e)) {
            this.emit.error(e);
        }
    }
    /**
     * Property allowing access to invoke a moment from within this timeline
     */
    get emit() {
        if (this._emitProxy === null) {
            this._emitProxy = new Proxy(this, {
                get: (target, p) => (...args) => {
                    // handle the case where no observers registered for the target moment
                    const observers = Reflect.has(target.observers, p) ? Reflect.get(target.observers, p) : [];
                    if ((!Object(_util_js__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "o"])(observers) || observers.length < 1) && p === "error") {
                        // if we are emitting an error, and no error observers are defined, we throw
                        throw Error(`Unhandled Exception: ${args[0]}`);
                    }
                    try {
                        // default to broadcasting any events without specific impl (will apply to log and error)
                        const moment = Reflect.has(target.moments, p) ? Reflect.get(target.moments, p) : p === "init" || p === "dispose" ? Object(_moments_js__WEBPACK_IMPORTED_MODULE_0__[/* lifecycle */ "a"])() : Object(_moments_js__WEBPACK_IMPORTED_MODULE_0__[/* broadcast */ "n"])();
                        // pass control to the individual moment's implementation
                        return Reflect.apply(moment, target, [observers, ...args]);
                    }
                    catch (e) {
                        if (p !== "error") {
                            this.error(e);
                        }
                        else {
                            // if all else fails, re-throw as we are getting errors from error observers meaning something is sideways
                            throw e;
                        }
                    }
                    finally {
                        // here we need to remove any "once" observers
                        if (observers && observers.length > 0) {
                            Reflect.set(target.observers, p, observers.filter(byFlag(2 /* ObserverLifecycleFlags.once */)));
                        }
                    }
                },
            });
        }
        return this._emitProxy;
    }
    /**
     * Starts a timeline
     *
     * @description This method first emits "init" to allow for any needed initial conditions then calls execute with any supplied init
     *
     * @param init A value passed into the execute logic from the initiator of the timeline
     * @returns The result of this.execute
     */
    start(init) {
        // initialize our timeline
        this.emit.init();
        // get a ref to the promise returned by execute
        const p = this.execute(init);
        // attach our dispose logic
        p.finally(() => {
            try {
                // provide an opportunity for cleanup of the timeline
                this.emit.dispose();
            }
            catch (e) {
                // shouldn't happen, but possible dispose throws - which may be missed as the usercode await will have resolved.
                const e2 = Object.assign(Error("Error in dispose."), { innerException: e });
                this.error(e2);
            }
        }).catch(() => void (0));
        // give the promise back to the caller
        return p;
    }
    /**
     * By default a timeline references the same observer collection as a parent timeline,
     * if any changes are made to the observers this method first clones them ensuring we
     * maintain a local copy and de-ref the parent
     */
    cloneObserversOnChange() {
        if (this._inheritingObservers) {
            this._inheritingObservers = false;
            this.observers = cloneObserverCollection(this.observers);
        }
    }
}
/**
 * Adds an observer to a given target
 *
 * @param target The object to which events are registered
 * @param moment The name of the moment to which the observer is registered
 * @param addBehavior Determines how the observer is added to the collection
 *
 */
function addObserver(target, moment, observer, addBehavior) {
    if (!Object(_util_js__WEBPACK_IMPORTED_MODULE_1__[/* isFunc */ "s"])(observer)) {
        throw Error("Observers must be functions.");
    }
    if (!Reflect.has(target, moment)) {
        // if we don't have a registration for this moment, then we just add a new prop
        target[moment] = [observer];
    }
    else {
        // if we have an existing property then we follow the specified behavior
        switch (addBehavior) {
            case 1 /* ObserverAddBehavior.Add */:
                target[moment].push(observer);
                break;
            case 2 /* ObserverAddBehavior.Prepend */:
                target[moment].unshift(observer);
                break;
            case 3 /* ObserverAddBehavior.Replace */:
                target[moment].length = 0;
                target[moment].push(observer);
                break;
        }
    }
    return target[moment];
}
function cloneObserverCollection(source) {
    return Reflect.ownKeys(source).reduce((clone, key) => {
        clone[key] = [...source[key].filter(byFlag(1 /* ObserverLifecycleFlags.noInherit */))];
        return clone;
    }, {});
}
//# sourceMappingURL=timeline.js.map

/***/ }),

/***/ "6k7F":
/*!********************************************!*\
  !*** ./node_modules/@pnp/sp/webs/index.js ***!
  \********************************************/
/*! exports provided: Web, Webs */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types.js */ "dVsc");
/* harmony import */ var _fi_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../fi.js */ "v6VW");



Reflect.defineProperty(_fi_js__WEBPACK_IMPORTED_MODULE_1__[/* SPFI */ "e"].prototype, "web", {
    configurable: true,
    enumerable: true,
    get: function () {
        return this.create(_types_js__WEBPACK_IMPORTED_MODULE_0__[/* Web */ "e"]);
    },
});
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "9iM+":
/*!********************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@microsoft/spfx-heft-plugins/node_modules/css-loader/dist/cjs.js!./node_modules/@microsoft/spfx-heft-plugins/node_modules/postcss-loader/dist/cjs.js??ref--6-2!./lib/webparts/auresApp/components/AuresApp.module.css ***!
  \********************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../../../node_modules/@microsoft/spfx-heft-plugins/node_modules/css-loader/dist/runtime/api.js */ "Z+AG");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, "@keyframes spin_3b2f6a0d{to{transform:rotate(1turn)}}@keyframes fadeUp_3b2f6a0d{0%{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}@keyframes fadeIn_3b2f6a0d{0%{opacity:0}to{opacity:1}}@keyframes shimmer_3b2f6a0d{0%{background-position:-200%}to{background-position:200%}}@keyframes pulseGold_3b2f6a0d{0%,to{box-shadow:0 0 0 0 rgba(201,168,76,.25)}50%{box-shadow:0 0 0 6px rgba(201,168,76,0)}}@keyframes slideInRight_3b2f6a0d{0%{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}.auresApp_3b2f6a0d{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;background:#f5f6f8;color:#1a1d23;font-family:Segoe UI,-apple-system,BlinkMacSystemFont,system-ui,sans-serif;font-size:14px;line-height:1.55;min-height:100%}.appShell_3b2f6a0d{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;min-height:100%}.header_3b2f6a0d{-ms-flex-align:center;-ms-flex-pack:justify;-ms-flex-negative:0;align-items:center;background:linear-gradient(135deg,#0a2647,#0f3460 50%,#1b4d8e);box-shadow:0 4px 24px rgba(10,38,71,.25);display:-ms-flexbox;display:flex;flex-shrink:0;height:60px;justify-content:space-between;padding:0 28px;position:relative;z-index:10}.header_3b2f6a0d:after{background:linear-gradient(90deg,transparent,#a88b3a 15%,#c9a84c 40%,#dac06e 60%,#a88b3a 85%,transparent);bottom:0;content:\"\";height:2px;left:0;position:absolute;right:0}.headerLeft_3b2f6a0d{gap:14px}.headerLeft_3b2f6a0d,.headerLogo_3b2f6a0d{-ms-flex-align:center;align-items:center;display:-ms-flexbox;display:flex}.headerLogo_3b2f6a0d{-ms-flex-pack:center;-ms-flex-negative:0;background:linear-gradient(135deg,#a88b3a,#c9a84c,#dac06e);border-radius:6px;box-shadow:0 2px 8px rgba(201,168,76,.3);color:#0a2647;flex-shrink:0;font-family:Arial,Helvetica,sans-serif;font-size:21px;font-weight:900;height:48px;justify-content:center;letter-spacing:0;min-width:90px;padding:0 16px;position:relative}.headerTitle_3b2f6a0d{color:hsla(0,0%,100%,.9);font-size:15px;font-weight:600;letter-spacing:.8px;text-transform:uppercase}.headerTitleAccent_3b2f6a0d{color:#c9a84c;font-weight:800;letter-spacing:1.5px}.headerUser_3b2f6a0d{backdrop-filter:blur(8px);background:hsla(0,0%,100%,.08);border:1px solid hsla(0,0%,100%,.1);border-radius:100px;color:hsla(0,0%,100%,.8);font-size:13px;letter-spacing:.2px;padding:6px 16px;transition:all .2s cubic-bezier(.4,0,.2,1)}.headerUser_3b2f6a0d:hover{background:hsla(0,0%,100%,.12);border-color:rgba(201,168,76,.3)}.roleSwitch_3b2f6a0d{background:linear-gradient(180deg,#081f3a,#0a2647);border-bottom:1px solid rgba(201,168,76,.12);display:-ms-flexbox;display:flex;gap:6px;padding:8px 28px}.roleBtnActive_3b2f6a0d,.roleBtn_3b2f6a0d{background:hsla(0,0%,100%,.04);border:1px solid hsla(0,0%,100%,.15);border-radius:100px;color:hsla(0,0%,100%,.65);cursor:pointer;font-family:inherit;font-size:12px;font-weight:500;letter-spacing:.4px;padding:5px 18px;text-transform:uppercase;transition:all .2s cubic-bezier(.4,0,.2,1)}.roleBtnActive_3b2f6a0d:hover,.roleBtn_3b2f6a0d:hover{background:hsla(0,0%,100%,.1);border-color:hsla(0,0%,100%,.25);color:hsla(0,0%,100%,.9)}.roleBtnActive_3b2f6a0d{background:rgba(201,168,76,.15);border-color:rgba(201,168,76,.4);box-shadow:0 0 12px rgba(201,168,76,.1);color:#dac06e;font-weight:700}.nav_3b2f6a0d{-ms-flex-negative:0;background:#fff;border-bottom:1px solid #e2e5eb;box-shadow:0 1px 2px rgba(10,38,71,.04);display:-ms-flexbox;display:flex;flex-shrink:0;gap:2px;padding:0 28px}.navTabActive_3b2f6a0d,.navTab_3b2f6a0d{-ms-flex-align:center;align-items:center;background:0 0;border:none;border-bottom:2.5px solid transparent;color:#7c8290;cursor:pointer;display:-ms-inline-flexbox;display:inline-flex;font-family:inherit;font-size:13.5px;letter-spacing:.2px;margin-bottom:-1px;padding:14px 20px;position:relative;transition:color .2s cubic-bezier(.4,0,.2,1),border-color .2s cubic-bezier(.4,0,.2,1),background .2s cubic-bezier(.4,0,.2,1);white-space:nowrap}.navTabActive_3b2f6a0d:hover,.navTab_3b2f6a0d:hover{background:rgba(27,106,224,.03);color:#4a5060}.navTabActive_3b2f6a0d{border-bottom-color:#c9a84c;color:#0a2647;font-weight:700;letter-spacing:.1px}.navBadge_3b2f6a0d{-ms-flex-align:center;-ms-flex-pack:center;align-items:center;animation:fadeUp_3b2f6a0d .3s cubic-bezier(.16,1,.3,1);background:#c53030;border-radius:100px;box-shadow:0 2px 6px rgba(197,48,48,.3);color:#fff;display:-ms-inline-flexbox;display:inline-flex;font-size:11px;font-weight:700;height:20px;justify-content:center;line-height:1;margin-left:8px;min-width:20px;padding:0 6px}.content_3b2f6a0d{animation:fadeIn_3b2f6a0d .25s ease;-ms-flex:1;flex:1;padding:32px 28px}.accessDenied_3b2f6a0d{-ms-flex-align:center;-ms-flex-pack:center;align-items:center;display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;justify-content:center;padding:100px 32px;text-align:center}.accessDenied_3b2f6a0d h2{color:#1a1d23;font-size:24px;font-weight:700;letter-spacing:-.3px;margin:20px 0 10px}.accessDenied_3b2f6a0d p{color:#7c8290;font-size:15px;line-height:1.7;margin:4px 0;max-width:400px}.accessDeniedIcon_3b2f6a0d{font-size:64px;line-height:1;opacity:.8}.pageTitle_3b2f6a0d{color:#1a1d23;font-size:24px;font-weight:700;letter-spacing:-.3px;margin:0 0 24px;padding-left:14px;position:relative}.pageTitle_3b2f6a0d:before{background:linear-gradient(180deg,#c9a84c,#a88b3a);border-radius:3px;bottom:4px;content:\"\";left:0;position:absolute;top:4px;width:3px}.pageHeader_3b2f6a0d{-ms-flex-pack:justify;-ms-flex-align:center;align-items:center;display:-ms-flexbox;display:flex;justify-content:space-between;margin-bottom:24px}.pageHeader_3b2f6a0d .pageTitle_3b2f6a0d{margin:0}.loading_3b2f6a0d{-ms-flex-align:center;-ms-flex-pack:center;align-items:center;color:#7c8290;display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;font-size:14px;gap:18px;justify-content:center;letter-spacing:.2px;padding:80px 32px}.loading_3b2f6a0d:before{animation:spin_3b2f6a0d .8s linear infinite;border:3px solid #eceef2;border-radius:50%;border-top-color:#c9a84c;content:\"\";display:block;height:40px;width:40px}.emptyState_3b2f6a0d{-ms-flex-align:center;-ms-flex-pack:center;align-items:center;color:#7c8290;display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;justify-content:center;padding:80px 32px;text-align:center}.emptyState_3b2f6a0d p{font-size:15px;line-height:1.7;margin:8px 0;max-width:380px}.sectionHint_3b2f6a0d{color:#7c8290;font-size:13px;line-height:1.55;margin:-14px 0 20px;padding-left:14px}.btnPrimary_3b2f6a0d{-ms-flex-align:center;-ms-flex-pack:center;align-items:center;background:linear-gradient(135deg,#1b6ae0,#1558b8);border:none;border-radius:6px;box-shadow:0 2px 6px rgba(27,106,224,.25);color:#fff;cursor:pointer;display:-ms-inline-flexbox;display:inline-flex;font-family:inherit;font-size:14px;font-weight:600;justify-content:center;letter-spacing:.2px;padding:10px 24px;transition:all .2s cubic-bezier(.4,0,.2,1);white-space:nowrap}.btnPrimary_3b2f6a0d:hover{background:linear-gradient(135deg,#2a75e5,#1b6ae0);box-shadow:0 4px 14px rgba(27,106,224,.35);transform:translateY(-1px)}.btnPrimary_3b2f6a0d:active{box-shadow:0 1px 4px rgba(27,106,224,.2);transform:translateY(0)}.btnPrimary_3b2f6a0d:disabled{background:#eceef2;box-shadow:none;color:#7c8290;cursor:not-allowed;transform:none}.btnSecondary_3b2f6a0d{-ms-flex-align:center;-ms-flex-pack:center;align-items:center;background:0 0;border:1.5px solid rgba(27,106,224,.35);border-radius:6px;color:#1b6ae0;cursor:pointer;display:-ms-inline-flexbox;display:inline-flex;font-family:inherit;font-size:14px;font-weight:600;justify-content:center;padding:9px 24px;transition:all .2s cubic-bezier(.4,0,.2,1);white-space:nowrap}.btnSecondary_3b2f6a0d:hover{background:rgba(27,106,224,.06);border-color:#1b6ae0}.btnSecondary_3b2f6a0d:disabled{cursor:not-allowed;opacity:.4}.btnBack_3b2f6a0d{-ms-flex-align:center;align-items:center;background:0 0;border:none;color:#1b6ae0;cursor:pointer;display:-ms-inline-flexbox;display:inline-flex;font-family:inherit;font-size:13px;font-weight:500;gap:6px;padding:0 0 16px;transition:color .2s cubic-bezier(.4,0,.2,1)}.btnBack_3b2f6a0d:hover{color:#1558b8;text-decoration:underline}.btnApprove_3b2f6a0d{-ms-flex-align:center;-ms-flex-pack:center;align-items:center;background:linear-gradient(135deg,#0d9f3f,#0a7930);border:none;border-radius:6px;box-shadow:0 2px 6px rgba(13,159,63,.25);color:#fff;cursor:pointer;display:-ms-inline-flexbox;display:inline-flex;font-family:inherit;font-size:14px;font-weight:700;justify-content:center;letter-spacing:.2px;padding:10px 28px;transition:all .2s cubic-bezier(.4,0,.2,1)}.btnApprove_3b2f6a0d:hover{box-shadow:0 4px 14px rgba(13,159,63,.35);transform:translateY(-1px)}.btnApprove_3b2f6a0d:disabled{box-shadow:none;cursor:not-allowed;opacity:.45;transform:none}.btnReject_3b2f6a0d{-ms-flex-align:center;-ms-flex-pack:center;align-items:center;background:0 0;border:1.5px solid rgba(197,48,48,.35);border-radius:6px;color:#c53030;cursor:pointer;display:-ms-inline-flexbox;display:inline-flex;font-family:inherit;font-size:14px;font-weight:700;justify-content:center;letter-spacing:.2px;padding:10px 28px;transition:all .2s cubic-bezier(.4,0,.2,1)}.btnReject_3b2f6a0d:hover{background:#fee5e5;border-color:#c53030}.btnReject_3b2f6a0d:disabled{cursor:not-allowed;opacity:.45}.mentorGrid_3b2f6a0d{animation:fadeUp_3b2f6a0d .3s cubic-bezier(.16,1,.3,1);display:grid;gap:20px;grid-template-columns:repeat(auto-fill,minmax(300px,1fr))}.mentorCard_3b2f6a0d{background:#fff;border:1px solid #e2e5eb;border-radius:14px;box-shadow:0 1px 4px rgba(10,38,71,.06),0 1px 2px rgba(10,38,71,.04);display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;gap:12px;overflow:hidden;padding:24px;position:relative;transition:transform .28s cubic-bezier(.16,1,.3,1),box-shadow .28s cubic-bezier(.16,1,.3,1),border-color .2s cubic-bezier(.4,0,.2,1)}.mentorCard_3b2f6a0d:before{background:linear-gradient(90deg,transparent,#c9a84c,transparent);content:\"\";height:2px;left:0;opacity:0;position:absolute;right:0;top:0;transition:opacity .28s cubic-bezier(.16,1,.3,1)}.mentorCard_3b2f6a0d:hover{border-color:rgba(201,168,76,.25);box-shadow:0 8px 32px rgba(10,38,71,.1),0 2px 8px rgba(10,38,71,.05);transform:translateY(-4px)}.mentorCard_3b2f6a0d:hover:before{opacity:1}.mentorCardHeader_3b2f6a0d{gap:16px}.mentorAvatar_3b2f6a0d,.mentorCardHeader_3b2f6a0d{-ms-flex-align:center;align-items:center;display:-ms-flexbox;display:flex}.mentorAvatar_3b2f6a0d{-ms-flex-pack:center;-ms-flex-negative:0;background:linear-gradient(135deg,#0a2647,#0f3460);border-radius:50%;color:#fff;flex-shrink:0;font-size:17px;font-weight:700;height:54px;justify-content:center;letter-spacing:.5px;position:relative;width:54px}.mentorAvatar_3b2f6a0d:after{border:2px solid rgba(201,168,76,.4);border-radius:50%;content:\"\";inset:-3px;position:absolute}.mentorName_3b2f6a0d{color:#1a1d23;font-size:16px;font-weight:700;letter-spacing:-.1px;margin:0 0 2px}.mentorJobTitle_3b2f6a0d{color:#7c8290;font-size:11.5px;font-weight:600;letter-spacing:.6px;margin:0;text-transform:uppercase}.mentorCapacityFull_3b2f6a0d,.mentorCapacity_3b2f6a0d{display:none}.mentorSuperpower_3b2f6a0d{-ms-flex-align:center;align-items:center;color:#a88b3a;display:-ms-flexbox;display:flex;font-size:13px;font-weight:600;gap:6px;line-height:1.5;margin:4px 0 0}.mentorSuperpower_3b2f6a0d:before{color:#c9a84c;content:\"\\2726\";font-size:11px}.mentorAvatarPhoto_3b2f6a0d{background-position:50%;background-size:cover;border:none;box-shadow:0 0 0 3px rgba(201,168,76,.25);color:transparent;height:80px;width:80px}.mentorBio_3b2f6a0d{color:#4a5060;font-size:13.5px;line-height:1.65;margin:0 0 8px}.mentorDetails_3b2f6a0d{-ms-flex:1;flex:1;margin-bottom:12px}.mentorDetailsToggle_3b2f6a0d{-ms-flex-align:center;align-items:center;background:0 0;border:none;color:#1b6ae0;cursor:pointer;display:-ms-flexbox;display:flex;font-size:13px;font-weight:600;gap:6px;padding:4px 0}.mentorDetailsToggle_3b2f6a0d:hover{color:#a88b3a}.mentorDetailsToggle_3b2f6a0d:before{content:\"\\25B8\";font-size:11px;transition:transform .2s ease}.mentorDetailsContent_3b2f6a0d{animation:fadeUp_3b2f6a0d .3s ease;color:#4a5060;font-size:13.5px;line-height:1.65;padding-top:8px}.mentorChallenge_3b2f6a0d{background:rgba(27,106,224,.04);border-left:3px solid #c9a84c;border-radius:6px;color:#1b6ae0;font-size:13px;line-height:1.6;margin-top:10px;padding:10px 14px}.mentorAvailability_3b2f6a0d{background:#f5f6f8;border-left:2px solid #c9a84c;border-radius:6px;color:#7c8290;font-size:12px;font-style:italic;margin:0;padding:8px 12px}.mentorCardActions_3b2f6a0d{margin-top:6px}.requestForm_3b2f6a0d{animation:fadeUp_3b2f6a0d .3s cubic-bezier(.16,1,.3,1);gap:32px;max-width:760px}.formSection_3b2f6a0d,.requestForm_3b2f6a0d{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column}.formSection_3b2f6a0d{gap:14px}.formSectionTitle_3b2f6a0d{border-bottom:2px solid #e2e5eb;color:#1a1d23;font-size:15px;font-weight:700;letter-spacing:-.1px;margin:0;padding-bottom:12px;position:relative}.formSectionTitle_3b2f6a0d:after{background:#c9a84c;bottom:-2px;content:\"\";height:2px;left:0;position:absolute;width:40px}.mentorSelectList_3b2f6a0d{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;gap:10px}.mentorSelectItem_3b2f6a0d{-ms-flex-align:start;align-items:flex-start;border:1.5px solid #e2e5eb;border-radius:10px;cursor:pointer;display:-ms-flexbox;display:flex;gap:14px;padding:16px;transition:border-color .2s cubic-bezier(.4,0,.2,1),background .2s cubic-bezier(.4,0,.2,1),box-shadow .2s cubic-bezier(.4,0,.2,1)}.mentorSelectItem_3b2f6a0d:hover{background:rgba(27,106,224,.06);border-color:#1b6ae0;box-shadow:0 1px 2px rgba(10,38,71,.04)}.mentorSelectItemChecked_3b2f6a0d{background:rgba(27,106,224,.06);border-color:#1b6ae0;box-shadow:0 0 0 3px rgba(27,106,224,.14)}.mentorSelectDisabled_3b2f6a0d{cursor:not-allowed;opacity:.38}.mentorSelectDisabled_3b2f6a0d:hover{background:0 0;border-color:#e2e5eb;box-shadow:none}.mentorSelectCheckbox_3b2f6a0d{-ms-flex-negative:0;accent-color:#1b6ae0;cursor:pointer;flex-shrink:0;height:17px;margin-top:3px;width:17px}.mentorSelectInfo_3b2f6a0d{-ms-flex:1;flex:1;min-width:0}.mentorSelectName_3b2f6a0d{color:#1a1d23;font-size:14px;font-weight:600;margin:0 0 3px}.mentorSelectJobTitle_3b2f6a0d{color:#7c8290;font-size:12px;margin:0}.messageGroup_3b2f6a0d{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;gap:7px}.messageLabel_3b2f6a0d{color:#1a1d23;font-size:13px;font-weight:600}.messageTextarea_3b2f6a0d{background:#fff;border:1.5px solid #e2e5eb;border-radius:10px;box-sizing:border-box;color:#1a1d23;font-family:inherit;font-size:13.5px;line-height:1.65;min-height:92px;padding:12px 14px;resize:vertical;transition:border-color .2s cubic-bezier(.4,0,.2,1),box-shadow .2s cubic-bezier(.4,0,.2,1);width:100%}.messageTextarea_3b2f6a0d:focus{border-color:#1b6ae0;box-shadow:0 0 0 3px rgba(27,106,224,.14);outline:0}.messageTextarea_3b2f6a0d:-ms-input-placeholder{color:#7c8290;font-style:italic}.messageTextarea:-ms-input-placeholder{color:#7c8290;font-style:italic}.messageTextarea_3b2f6a0d::placeholder{color:#7c8290;font-style:italic}.formActions_3b2f6a0d{-ms-flex-wrap:wrap;flex-wrap:wrap;gap:12px}.formActions_3b2f6a0d,.formError_3b2f6a0d{-ms-flex-align:center;align-items:center;display:-ms-flexbox;display:flex}.formError_3b2f6a0d{color:#c53030;font-size:13px;font-weight:500;gap:6px}.formError_3b2f6a0d:before{content:\"\\26A0\";font-size:14px}.requestList_3b2f6a0d{animation:fadeUp_3b2f6a0d .3s cubic-bezier(.16,1,.3,1);display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;gap:12px}.requestCard_3b2f6a0d{background:#fff;border:1px solid #e2e5eb;border-radius:10px;box-shadow:0 1px 4px rgba(10,38,71,.06),0 1px 2px rgba(10,38,71,.04);padding:18px 22px;transition:box-shadow .2s cubic-bezier(.4,0,.2,1),border-color .2s cubic-bezier(.4,0,.2,1)}.requestCard_3b2f6a0d:hover{box-shadow:0 4px 16px rgba(10,38,71,.08),0 1px 4px rgba(10,38,71,.04)}.requestCardHeader_3b2f6a0d{-ms-flex-pack:justify;-ms-flex-align:start;align-items:flex-start;display:-ms-flexbox;display:flex;gap:14px;justify-content:space-between;margin-bottom:12px}.requestTitle_3b2f6a0d{color:#1a1d23;font-size:15px;font-weight:700;letter-spacing:-.1px;margin:0}.statusBadge_3b2f6a0d{-ms-flex-align:center;-ms-flex-negative:0;align-items:center;border-radius:100px;display:-ms-inline-flexbox;display:inline-flex;flex-shrink:0;font-size:12px;font-weight:700;letter-spacing:.2px;padding:4px 14px;white-space:nowrap}.statusPending_3b2f6a0d{background:#fff8e7;border:1px solid rgba(184,134,11,.15);color:#b8860b}.statusApproved_3b2f6a0d{background:#e6f9ed;border:1px solid rgba(13,159,63,.15);color:#0d9f3f}.statusHR_3b2f6a0d{background:#fee5e5;border:1px solid rgba(197,48,48,.15);color:#c53030}.statusScheduled_3b2f6a0d{background:#ebf3fe;border:1px solid rgba(27,106,224,.15);color:#1b6ae0}.statusCancelled_3b2f6a0d{background:#eceef2;border:1px solid #eceef2;color:#7c8290}.requestMentors_3b2f6a0d{display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap;gap:6px}.mentorTag_3b2f6a0d{-ms-flex-align:center;align-items:center;background:#eceef2;border-radius:100px;color:#4a5060;display:-ms-inline-flexbox;display:inline-flex;font-size:12px;font-weight:500;gap:4px;padding:4px 12px}.mentorTagCurrent_3b2f6a0d{background:#ebf3fe;border:1px solid rgba(27,106,224,.12);color:#1b6ae0;font-weight:700}.mentorTagApproved_3b2f6a0d{background:#e6f9ed;border:1px solid rgba(13,159,63,.12);color:#0d9f3f}.mentorTagRejected_3b2f6a0d{background:#fee5e5;border:1px solid rgba(197,48,48,.12);color:#c53030;text-decoration:line-through}.pendingRow_3b2f6a0d{-ms-flex-align:center;align-items:center;background:#fff;border:1px solid #e2e5eb;border-radius:10px;box-shadow:0 1px 4px rgba(10,38,71,.06),0 1px 2px rgba(10,38,71,.04);cursor:pointer;display:-ms-flexbox;display:flex;gap:16px;padding:18px 22px;transition:transform .28s cubic-bezier(.16,1,.3,1),box-shadow .28s cubic-bezier(.16,1,.3,1),border-color .2s cubic-bezier(.4,0,.2,1)}.pendingRow_3b2f6a0d:hover{border-color:rgba(201,168,76,.3);box-shadow:0 4px 16px rgba(10,38,71,.08),0 1px 4px rgba(10,38,71,.04);transform:translateX(4px)}.pendingRowLeft_3b2f6a0d{-ms-flex:1;flex:1;min-width:0}.pendingRowHeader_3b2f6a0d{-ms-flex-align:center;align-items:center;display:-ms-flexbox;display:flex;gap:10px;margin-bottom:6px}.stageIndicator_3b2f6a0d{-ms-flex-align:center;-ms-flex-negative:0;align-items:center;background:rgba(201,168,76,.08);border:1px solid rgba(201,168,76,.2);border-radius:100px;color:#a88b3a;display:-ms-inline-flexbox;display:inline-flex;flex-shrink:0;font-size:11px;font-weight:700;letter-spacing:.4px;padding:3px 12px}.talentName_3b2f6a0d{color:#7c8290;font-size:13px;font-weight:500;margin:0 0 4px}.messagePreview_3b2f6a0d{color:#4a5060;font-size:13px;margin:0;opacity:.7;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.arrowIcon_3b2f6a0d{-ms-flex-negative:0;color:#e2e5eb;flex-shrink:0;font-size:24px;transition:color .2s cubic-bezier(.4,0,.2,1),transform .2s cubic-bezier(.4,0,.2,1)}.pendingRow_3b2f6a0d:hover .arrowIcon_3b2f6a0d{color:#c9a84c;transform:translateX(3px)}.requestDetailCard_3b2f6a0d{animation:fadeUp_3b2f6a0d .3s cubic-bezier(.16,1,.3,1);background:#fff;border:1px solid #e2e5eb;border-radius:14px;box-shadow:0 4px 16px rgba(10,38,71,.08),0 1px 4px rgba(10,38,71,.04);display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;gap:28px;max-width:740px;padding:28px;position:relative}.requestDetailCard_3b2f6a0d:before{background:linear-gradient(90deg,transparent,#c9a84c,transparent);border-radius:0 0 2px 2px;content:\"\";height:2px;left:24px;position:absolute;right:24px;top:0}.detailSection_3b2f6a0d{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;gap:8px}.detailLabel_3b2f6a0d{color:#7c8290;font-size:11px;font-weight:700;letter-spacing:.8px;margin:0;text-transform:uppercase}.detailValue_3b2f6a0d{color:#1a1d23;font-size:16px;font-weight:600;margin:0}.talentMessage_3b2f6a0d{background:linear-gradient(135deg,rgba(201,168,76,.04),rgba(201,168,76,.08));border-left:3px solid #c9a84c;border-radius:0 6px 6px 0;color:#1a1d23;font-size:14px;font-style:italic;line-height:1.75;padding:16px 20px}.decisionBtns_3b2f6a0d{-ms-flex-align:center;align-items:center;display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap;gap:14px}.rejectHint_3b2f6a0d{background:#f5f6f8;border-left:2px solid #e2e5eb;border-radius:6px;color:#7c8290;font-size:12px;font-style:italic;margin:8px 0 0;padding:10px 14px}.decisionConfirm_3b2f6a0d{-ms-flex-align:center;align-items:center;background:#e6f9ed;border:1px solid rgba(13,159,63,.15);border-radius:10px;color:#0d9f3f;display:-ms-flexbox;display:flex;font-size:15px;font-weight:700;gap:10px;padding:16px 20px}.decisionConfirm_3b2f6a0d:before{content:\"\\2713\";font-size:18px;font-weight:900}.historyCard_3b2f6a0d{-ms-flex-pack:justify;-ms-flex-align:center;align-items:center;background:#fff;border:1px solid #e2e5eb;border-radius:10px;box-shadow:0 1px 4px rgba(10,38,71,.06),0 1px 2px rgba(10,38,71,.04);display:-ms-flexbox;display:flex;gap:16px;justify-content:space-between;padding:16px 22px;transition:box-shadow .2s cubic-bezier(.4,0,.2,1),transform .2s cubic-bezier(.4,0,.2,1)}.historyCard_3b2f6a0d:hover{box-shadow:0 4px 16px rgba(10,38,71,.08),0 1px 4px rgba(10,38,71,.04);transform:translateY(-1px)}.historyLeft_3b2f6a0d{-ms-flex:1;flex:1;min-width:0}.historyTitle_3b2f6a0d{color:#1a1d23;font-size:14px;font-weight:600;margin:0 0 4px}.historyMeta_3b2f6a0d{color:#7c8290;font-size:12px;margin:0}.decisionBadge_3b2f6a0d{-ms-flex-align:center;align-items:center;border-radius:100px;display:-ms-inline-flexbox;display:inline-flex;font-size:12px;font-weight:700;padding:4px 16px;white-space:nowrap}.decisionApproved_3b2f6a0d{background:#e6f9ed;border:1px solid rgba(13,159,63,.15);color:#0d9f3f}.decisionRejected_3b2f6a0d{background:#fee5e5;border:1px solid rgba(197,48,48,.15);color:#c53030}.filterRow_3b2f6a0d{-ms-flex-align:center;align-items:center;gap:14px;margin-bottom:20px}.filterBar_3b2f6a0d,.filterRow_3b2f6a0d{display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap}.filterBar_3b2f6a0d{gap:6px}.filterBtnActive_3b2f6a0d,.filterBtn_3b2f6a0d{background:0 0;border:1.5px solid #e2e5eb;border-radius:100px;color:#7c8290;cursor:pointer;font-family:inherit;font-size:13px;font-weight:500;padding:6px 16px;transition:all .2s cubic-bezier(.4,0,.2,1)}.filterBtnActive_3b2f6a0d:hover,.filterBtn_3b2f6a0d:hover{background:rgba(27,106,224,.06);border-color:#1b6ae0;color:#1b6ae0}.filterBtnActive_3b2f6a0d{background:linear-gradient(135deg,#0a2647,#0f3460);border-color:#0a2647;box-shadow:0 2px 6px rgba(10,38,71,.2);color:#fff;font-weight:700}.searchInput_3b2f6a0d{background:#fff;border:1.5px solid #e2e5eb;border-radius:6px;color:#1a1d23;-ms-flex:1;flex:1;font-family:inherit;font-size:13px;min-width:200px;padding:8px 14px;transition:border-color .2s cubic-bezier(.4,0,.2,1),box-shadow .2s cubic-bezier(.4,0,.2,1)}.searchInput_3b2f6a0d:focus{border-color:#1b6ae0;box-shadow:0 0 0 3px rgba(27,106,224,.14);outline:0}.searchInput_3b2f6a0d:-ms-input-placeholder{color:#7c8290}.searchInput:-ms-input-placeholder{color:#7c8290}.searchInput_3b2f6a0d::placeholder{color:#7c8290}.allRequestRow_3b2f6a0d{-ms-flex-pack:justify;-ms-flex-align:center;align-items:center;background:#fff;border:1px solid #e2e5eb;border-radius:10px;box-shadow:0 1px 4px rgba(10,38,71,.06),0 1px 2px rgba(10,38,71,.04);display:-ms-flexbox;display:flex;gap:16px;justify-content:space-between;padding:14px 20px;transition:box-shadow .2s cubic-bezier(.4,0,.2,1)}.allRequestRow_3b2f6a0d:hover{box-shadow:0 4px 16px rgba(10,38,71,.08),0 1px 4px rgba(10,38,71,.04)}.allRequestMain_3b2f6a0d{display:-ms-flexbox;display:flex;-ms-flex:1;flex:1;-ms-flex-direction:column;flex-direction:column;gap:3px;min-width:0}.allRequestMeta_3b2f6a0d{-ms-flex-align:center;-ms-flex-negative:0;align-items:center;display:-ms-flexbox;display:flex;flex-shrink:0;gap:10px}.hrReviewCard_3b2f6a0d{background:#fff;border:1px solid #e2e5eb;border-left:4px solid #c9a84c;border-radius:10px;box-shadow:0 1px 4px rgba(10,38,71,.06),0 1px 2px rgba(10,38,71,.04);display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;gap:14px;padding:20px 22px;transition:box-shadow .2s cubic-bezier(.4,0,.2,1)}.hrReviewCard_3b2f6a0d:hover{box-shadow:0 4px 16px rgba(10,38,71,.08),0 1px 4px rgba(10,38,71,.04)}.hrReviewHeader_3b2f6a0d{-ms-flex-align:baseline;align-items:baseline;gap:12px}.hrActionsBar_3b2f6a0d,.hrReviewHeader_3b2f6a0d{display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap}.hrActionsBar_3b2f6a0d{gap:10px;padding-top:4px}.managementList_3b2f6a0d{animation:fadeUp_3b2f6a0d .3s cubic-bezier(.16,1,.3,1);display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;gap:10px}.managementRow_3b2f6a0d{-ms-flex-align:center;align-items:center;background:#fff;border:1px solid #e2e5eb;border-radius:10px;box-shadow:0 1px 4px rgba(10,38,71,.06),0 1px 2px rgba(10,38,71,.04);display:-ms-flexbox;display:flex;gap:18px;padding:16px 20px;transition:opacity .2s cubic-bezier(.4,0,.2,1),box-shadow .2s cubic-bezier(.4,0,.2,1)}.managementRow_3b2f6a0d:hover{box-shadow:0 4px 16px rgba(10,38,71,.08),0 1px 4px rgba(10,38,71,.04)}.managementRowInactive_3b2f6a0d{opacity:.4}.managementInfo_3b2f6a0d{-ms-flex:1;flex:1;min-width:0}.managementName_3b2f6a0d{color:#1a1d23;font-size:14px;font-weight:600;margin:0 0 3px}.managementMeta_3b2f6a0d{color:#7c8290;font-size:12px;margin:0}.managementCapacity_3b2f6a0d{-ms-flex-negative:0;flex-shrink:0}.capacityEdit_3b2f6a0d{background:0 0;border:1.5px dashed #e2e5eb;border-radius:6px;color:#7c8290;cursor:pointer;font-family:inherit;font-size:13px;padding:6px 14px;transition:all .2s cubic-bezier(.4,0,.2,1)}.capacityEdit_3b2f6a0d:hover{background:rgba(201,168,76,.08);border-color:#c9a84c;border-style:solid;color:#a88b3a}.inlineEditGroup_3b2f6a0d{-ms-flex-align:center;align-items:center;display:-ms-flexbox;display:flex;gap:6px}.inlineInput_3b2f6a0d{border:1.5px solid #1b6ae0;border-radius:6px;box-shadow:0 0 0 3px rgba(27,106,224,.14);font-family:inherit;font-size:13px;padding:6px 10px;text-align:center;width:64px}.inlineInput_3b2f6a0d:focus{outline:0}.inlineSave_3b2f6a0d{background:linear-gradient(135deg,#1b6ae0,#1558b8);border:none;border-radius:6px;color:#fff;cursor:pointer;font-family:inherit;font-size:12px;font-weight:700;padding:6px 12px}.inlineSave_3b2f6a0d:hover{box-shadow:0 2px 6px rgba(27,106,224,.3)}.inlineSave_3b2f6a0d:disabled{opacity:.45}.inlineCancel_3b2f6a0d{background:0 0;border:1px solid #e2e5eb;border-radius:6px;color:#7c8290;cursor:pointer;font-family:inherit;font-size:12px;padding:6px 12px}.inlineCancel_3b2f6a0d:hover{background:#f5f6f8}.activeBtn_3b2f6a0d{-ms-flex-negative:0;background:#e6f9ed;border:1.5px solid rgba(13,159,63,.18);border-radius:100px;color:#0d9f3f;cursor:pointer;flex-shrink:0;font-family:inherit;font-size:12px;font-weight:700;padding:5px 16px;transition:all .2s cubic-bezier(.4,0,.2,1)}.activeBtn_3b2f6a0d:hover{background:#d6f5e1}.inactiveBtn_3b2f6a0d{-ms-flex-negative:0;background:#eceef2;border:1.5px solid #e2e5eb;border-radius:100px;color:#7c8290;cursor:pointer;flex-shrink:0;font-family:inherit;font-size:12px;font-weight:700;padding:5px 16px;transition:all .2s cubic-bezier(.4,0,.2,1)}.inactiveBtn_3b2f6a0d:hover{background:#f5f6f8}.capacityList_3b2f6a0d{animation:fadeUp_3b2f6a0d .3s cubic-bezier(.16,1,.3,1);display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;gap:14px}.capacityRow_3b2f6a0d{-ms-flex-align:center;align-items:center;background:#fff;border:1px solid #e2e5eb;border-radius:10px;box-shadow:0 1px 4px rgba(10,38,71,.06),0 1px 2px rgba(10,38,71,.04);display:grid;gap:22px;grid-template-columns:1fr auto 220px;padding:18px 22px;transition:box-shadow .2s cubic-bezier(.4,0,.2,1)}.capacityRow_3b2f6a0d:hover{box-shadow:0 4px 16px rgba(10,38,71,.08),0 1px 4px rgba(10,38,71,.04)}.capacityMentorInfo_3b2f6a0d{min-width:0}.capacityStats_3b2f6a0d{-ms-flex-align:end;align-items:flex-end;display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;gap:2px;white-space:nowrap}.capacityStat_3b2f6a0d{color:#1a1d23;font-size:16px;font-weight:700}.capacityRemaining_3b2f6a0d{color:#0d9f3f;font-size:12px;font-weight:600}.capacityFull_3b2f6a0d{color:#c53030}.capacityBarWrap_3b2f6a0d{background:#eceef2;border-radius:100px;height:8px;overflow:hidden}.capacityBarFill_3b2f6a0d{border-radius:100px;height:100%;transition:width .6s cubic-bezier(.16,1,.3,1)}.barOk_3b2f6a0d{background:linear-gradient(90deg,#0d9f3f,#34c759)}.barHigh_3b2f6a0d{background:linear-gradient(90deg,#a88b3a,#c9a84c)}.barFull_3b2f6a0d{background:linear-gradient(90deg,#c53030,#e53e3e)}.primaryMentorCard_3b2f6a0d{background:#fff;border:2px solid rgba(201,168,76,.35);border-radius:14px;box-shadow:0 4px 16px rgba(10,38,71,.08),0 1px 4px rgba(10,38,71,.04),0 0 0 1px rgba(201,168,76,.08);overflow:hidden;padding:28px;position:relative}.primaryMentorCard_3b2f6a0d:before{background:linear-gradient(90deg,#a88b3a,#c9a84c,#dac06e,#a88b3a);content:\"\";height:3px;left:0;position:absolute;right:0;top:0}.primaryMentorHeader_3b2f6a0d{-ms-flex-wrap:wrap;flex-wrap:wrap;gap:20px;margin-bottom:16px}.primaryMentorAvatar_3b2f6a0d,.primaryMentorHeader_3b2f6a0d{-ms-flex-align:center;align-items:center;display:-ms-flexbox;display:flex}.primaryMentorAvatar_3b2f6a0d{-ms-flex-pack:center;-ms-flex-negative:0;background:linear-gradient(135deg,#0a2647,#0f3460);border-radius:50%;color:#fff;flex-shrink:0;font-size:22px;font-weight:700;height:72px;justify-content:center;position:relative;width:72px}.primaryMentorAvatar_3b2f6a0d:after{border:2.5px solid #c9a84c;border-radius:50%;box-shadow:0 4px 20px rgba(201,168,76,.2);content:\"\";inset:-4px;position:absolute}.primaryMentorInfo_3b2f6a0d{-ms-flex:1;flex:1;min-width:0}.primaryMentorName_3b2f6a0d{color:#1a1d23;font-size:20px;font-weight:700;letter-spacing:-.2px;margin:0 0 4px}.primaryMentorJobTitle_3b2f6a0d{color:#7c8290;font-size:12px;font-weight:600;letter-spacing:.6px;margin:0 0 4px;text-transform:uppercase}.primaryMentorSuperpower_3b2f6a0d{-ms-flex-align:center;align-items:center;color:#a88b3a;display:-ms-flexbox;display:flex;font-size:14px;font-weight:600;gap:6px;margin:0}.primaryMentorSuperpower_3b2f6a0d:before{color:#c9a84c;content:\"\\2726\";font-size:12px}.primaryMentorBadge_3b2f6a0d{-ms-flex-align:center;-ms-flex-negative:0;align-items:center;background:linear-gradient(135deg,rgba(201,168,76,.08),rgba(201,168,76,.15));border:1px solid rgba(201,168,76,.3);border-radius:100px;color:#a88b3a;display:-ms-inline-flexbox;display:inline-flex;flex-shrink:0;font-size:12px;font-weight:700;letter-spacing:.4px;padding:5px 16px;white-space:nowrap}.primaryMentorBio_3b2f6a0d{color:#4a5060;font-size:14px;line-height:1.7;margin:0}.formSectionHint_3b2f6a0d{color:#7c8290;font-size:13px;line-height:1.6;margin:-8px 0 8px}.backupMentorList_3b2f6a0d{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;gap:10px}.backupMentorRow_3b2f6a0d{-ms-flex-align:center;-ms-flex-pack:justify;align-items:center;border:1.5px solid #e2e5eb;border-radius:10px;display:-ms-flexbox;display:flex;gap:14px;justify-content:space-between;padding:14px 18px;transition:border-color .2s cubic-bezier(.4,0,.2,1),background .2s cubic-bezier(.4,0,.2,1),box-shadow .2s cubic-bezier(.4,0,.2,1)}.backupMentorRow_3b2f6a0d:hover{background:rgba(27,106,224,.06);border-color:rgba(27,106,224,.25)}.backupMentorRowSelected_3b2f6a0d{background:rgba(27,106,224,.06);border-color:#1b6ae0;box-shadow:0 0 0 2px rgba(27,106,224,.14)}.backupMentorInfo_3b2f6a0d{-ms-flex-align:center;align-items:center;display:-ms-flexbox;display:flex;-ms-flex:1;flex:1;gap:14px;min-width:0}.backupMentorActions_3b2f6a0d{-ms-flex-align:center;-ms-flex-negative:0;align-items:center;display:-ms-flexbox;display:flex;flex-shrink:0;gap:10px}.backupMentorLabel_3b2f6a0d{background:#ebf3fe;border:1px solid rgba(27,106,224,.12);border-radius:100px;color:#1b6ae0}.backupMentorLabelTertiary_3b2f6a0d,.backupMentorLabel_3b2f6a0d{display:-ms-inline-flexbox;display:inline-flex;font-size:11px;font-weight:700;padding:3px 12px;white-space:nowrap}.backupMentorLabelTertiary_3b2f6a0d{background:rgba(201,168,76,.08);border:1px solid rgba(201,168,76,.2);border-radius:100px;color:#a88b3a}.myRequestMentorRow_3b2f6a0d{-ms-flex-pack:justify;-ms-flex-align:center;align-items:center;display:-ms-flexbox;display:flex;justify-content:space-between;padding:10px 0}.myRequestMentorRow_3b2f6a0d:not(:last-child){border-bottom:1px solid #eceef2}.myRequestMentorName_3b2f6a0d{color:#1a1d23;font-size:15px;font-weight:600}.statusQueued_3b2f6a0d{background:#eceef2;border:1px solid #eceef2;color:#7c8290}.resetChoiceCard_3b2f6a0d{background:#fff;border:1px solid #e2e5eb;border-radius:14px;box-shadow:0 4px 16px rgba(10,38,71,.08),0 1px 4px rgba(10,38,71,.04);display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;gap:18px;max-width:600px;padding:28px}.resetChoiceText_3b2f6a0d{color:#4a5060;font-size:14px;line-height:1.7;margin:0}.resetChoiceWarning_3b2f6a0d{background:#fee5e5;border-left:3px solid #c53030;border-radius:6px;color:#c53030;font-size:13px;font-weight:600;margin:0;padding:10px 14px}.hrRequestRow_3b2f6a0d{-ms-flex-pack:justify;-ms-flex-align:center;align-items:center;background:#fff;border:1px solid #e2e5eb;border-radius:10px;box-shadow:0 1px 4px rgba(10,38,71,.06),0 1px 2px rgba(10,38,71,.04);display:-ms-flexbox;display:flex;gap:16px;justify-content:space-between;padding:16px 20px;transition:box-shadow .2s cubic-bezier(.4,0,.2,1)}.hrRequestRow_3b2f6a0d:hover{box-shadow:0 4px 16px rgba(10,38,71,.08),0 1px 4px rgba(10,38,71,.04)}.hrRequestMain_3b2f6a0d{display:-ms-flexbox;display:flex;-ms-flex:1;flex:1;-ms-flex-direction:column;flex-direction:column;gap:6px;min-width:0}.hrRequestNames_3b2f6a0d{-ms-flex-align:center;align-items:center;display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap;gap:8px}.hrRequestTalent_3b2f6a0d{color:#1a1d23;font-size:14px;font-weight:700}.hrRequestArrow_3b2f6a0d{color:#7c8290;font-size:14px}.hrRequestMentor_3b2f6a0d{color:#1b6ae0;font-size:14px;font-weight:600}.hrRequestActions_3b2f6a0d{-ms-flex-align:center;-ms-flex-negative:0;align-items:center;display:-ms-flexbox;display:flex;flex-shrink:0;gap:6px}.hrActionBtn_3b2f6a0d{background:0 0;border:1px solid #e2e5eb;border-radius:6px;color:#7c8290;cursor:pointer;font-family:inherit;font-size:12px;font-weight:600;padding:5px 14px;transition:all .2s cubic-bezier(.4,0,.2,1);white-space:nowrap}.hrActionBtn_3b2f6a0d:hover{background:rgba(27,106,224,.06);border-color:#1b6ae0;color:#1b6ae0}.hrActionBtn_3b2f6a0d:disabled{cursor:not-allowed;opacity:.4}.hrActionBtnDanger_3b2f6a0d{background:0 0;border:1px solid #e2e5eb;border-radius:6px;color:#7c8290;cursor:pointer;font-family:inherit;font-size:12px;font-weight:600;padding:5px 14px;transition:all .2s cubic-bezier(.4,0,.2,1);white-space:nowrap}.hrActionBtnDanger_3b2f6a0d:hover{background:#fee5e5;border-color:#c53030;color:#c53030}.hrActionBtnDanger_3b2f6a0d:disabled{cursor:not-allowed;opacity:.4}.approvedPairRow_3b2f6a0d{-ms-flex-pack:justify;-ms-flex-align:center;align-items:center;background:#fff;border:1px solid #e2e5eb;border-left:3px solid #0d9f3f;border-radius:10px;box-shadow:0 1px 4px rgba(10,38,71,.06),0 1px 2px rgba(10,38,71,.04);display:-ms-flexbox;display:flex;gap:16px;justify-content:space-between;padding:16px 20px;transition:box-shadow .2s cubic-bezier(.4,0,.2,1)}.approvedPairRow_3b2f6a0d:hover{box-shadow:0 4px 16px rgba(10,38,71,.08),0 1px 4px rgba(10,38,71,.04)}.approvedPairInfo_3b2f6a0d{-ms-flex-align:center;align-items:center;display:-ms-flexbox;display:flex;-ms-flex:1;flex:1;gap:10px;min-width:0}.approvedPairTalent_3b2f6a0d{color:#1a1d23;font-size:14px;font-weight:700}.approvedPairArrow_3b2f6a0d{color:#c9a84c;font-size:16px;font-weight:700}.approvedPairMentor_3b2f6a0d{color:#1b6ae0;font-size:14px;font-weight:700}.mentorFormCard_3b2f6a0d{animation:fadeUp_3b2f6a0d .25s cubic-bezier(.16,1,.3,1);background:#fff;border:1px solid #e2e5eb;border-radius:14px;box-shadow:0 4px 16px rgba(10,38,71,.08),0 1px 4px rgba(10,38,71,.04);display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;gap:18px;margin-bottom:24px;padding:24px}.mentorFormGrid_3b2f6a0d{display:grid;gap:14px;grid-template-columns:1fr 1fr}.mentorFormFieldFull_3b2f6a0d,.mentorFormField_3b2f6a0d{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;gap:5px}.mentorFormFieldFull_3b2f6a0d{grid-column:1/-1}.formInput_3b2f6a0d{background:#fff;border:1.5px solid #e2e5eb;border-radius:6px;color:#1a1d23;font-family:inherit;font-size:13.5px;padding:9px 14px;transition:border-color .2s cubic-bezier(.4,0,.2,1),box-shadow .2s cubic-bezier(.4,0,.2,1)}.formInput_3b2f6a0d:focus{border-color:#1b6ae0;box-shadow:0 0 0 3px rgba(27,106,224,.14);outline:0}.formInput_3b2f6a0d:-ms-input-placeholder{color:#7c8290}.formInput:-ms-input-placeholder{color:#7c8290}.formInput_3b2f6a0d::placeholder{color:#7c8290}.managementCapacityLabel_3b2f6a0d{-ms-flex-negative:0;background:#f5f6f8;border-radius:6px;color:#7c8290;flex-shrink:0;font-size:13px;font-weight:500;padding:4px 12px}.deleteConfirm_3b2f6a0d{-ms-flex-align:center;align-items:center;display:-ms-flexbox;display:flex;gap:6px}.deleteConfirmText_3b2f6a0d{color:#c53030;font-size:12px;font-weight:600}", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "AfLD":
/*!***************************************************!*\
  !*** ./node_modules/@pnp/sp/sputilities/types.js ***!
  \***************************************************/
/*! exports provided: _Utilities, Utilities */
/*! exports used: Utilities */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export _Utilities */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return Utilities; });
/* harmony import */ var _pnp_queryable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @pnp/queryable */ "Ymo3");
/* harmony import */ var _spqueryable_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../spqueryable.js */ "F4qD");
/* harmony import */ var _utils_extract_web_url_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/extract-web-url.js */ "OXUt");
/* harmony import */ var _pnp_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @pnp/core */ "JC1J");




class _Utilities extends _spqueryable_js__WEBPACK_IMPORTED_MODULE_1__[/* _SPQueryable */ "r"] {
    constructor(base, methodName = "") {
        super(base);
        this._url = Object(_pnp_core__WEBPACK_IMPORTED_MODULE_3__[/* combine */ "o"])(Object(_utils_extract_web_url_js__WEBPACK_IMPORTED_MODULE_2__[/* extractWebUrl */ "e"])(this._url), `_api/SP.Utilities.Utility.${methodName}`);
    }
    excute(props) {
        return Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_1__[/* spPost */ "d"])(this, Object(_pnp_queryable__WEBPACK_IMPORTED_MODULE_0__[/* body */ "d"])(props));
    }
    sendEmail(properties) {
        if (properties.AdditionalHeaders) {
            // we have to remap the additional headers into this format #2253
            properties.AdditionalHeaders = Reflect.ownKeys(properties.AdditionalHeaders).map(key => ({
                Key: key,
                Value: Reflect.get(properties.AdditionalHeaders, key),
                ValueType: "Edm.String",
            }));
        }
        return UtilitiesCloneFactory(this, "SendEmail").excute({ properties });
    }
    getCurrentUserEmailAddresses() {
        return UtilitiesCloneFactory(this, "GetCurrentUserEmailAddresses").excute({});
    }
    resolvePrincipal(input, scopes, sources, inputIsEmailOnly, addToUserInfoList, matchUserInfoList = false) {
        const params = {
            addToUserInfoList,
            input,
            inputIsEmailOnly,
            matchUserInfoList,
            scopes,
            sources,
        };
        return UtilitiesCloneFactory(this, "ResolvePrincipalInCurrentContext").excute(params);
    }
    searchPrincipals(input, scopes, sources, groupName, maxCount) {
        const params = {
            groupName: groupName,
            input: input,
            maxCount: maxCount,
            scopes: scopes,
            sources: sources,
        };
        return UtilitiesCloneFactory(this, "SearchPrincipalsUsingContextWeb").excute(params);
    }
    createEmailBodyForInvitation(pageAddress) {
        const params = {
            pageAddress: pageAddress,
        };
        return UtilitiesCloneFactory(this, "CreateEmailBodyForInvitation").excute(params);
    }
    expandGroupsToPrincipals(inputs, maxCount = 30) {
        const params = {
            inputs: inputs,
            maxCount: maxCount,
        };
        const clone = UtilitiesCloneFactory(this, "ExpandGroupsToPrincipals");
        return clone.excute(params);
    }
}
const Utilities = Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_1__[/* spInvokableFactory */ "c"])(_Utilities);
const UtilitiesCloneFactory = (base, path) => Utilities(base, path);
//# sourceMappingURL=types.js.map

/***/ }),

/***/ "Bwa7":
/*!*******************************************!*\
  !*** ./node_modules/@pnp/sp/lists/web.js ***!
  \*******************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _pnp_queryable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @pnp/queryable */ "Ymo3");
/* harmony import */ var _webs_types_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../webs/types.js */ "dVsc");
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./types.js */ "hy0S");
/* harmony import */ var _utils_odata_url_from_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/odata-url-from.js */ "hTrG");
/* harmony import */ var _spqueryable_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../spqueryable.js */ "F4qD");
/* harmony import */ var _utils_encode_path_str_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/encode-path-str.js */ "vbtm");






Object(_pnp_queryable__WEBPACK_IMPORTED_MODULE_0__[/* addProp */ "c"])(_webs_types_js__WEBPACK_IMPORTED_MODULE_1__[/* _Web */ "t"], "lists", _types_js__WEBPACK_IMPORTED_MODULE_2__[/* Lists */ "t"]);
Object(_pnp_queryable__WEBPACK_IMPORTED_MODULE_0__[/* addProp */ "c"])(_webs_types_js__WEBPACK_IMPORTED_MODULE_1__[/* _Web */ "t"], "siteUserInfoList", _types_js__WEBPACK_IMPORTED_MODULE_2__[/* List */ "e"]);
Object(_pnp_queryable__WEBPACK_IMPORTED_MODULE_0__[/* addProp */ "c"])(_webs_types_js__WEBPACK_IMPORTED_MODULE_1__[/* _Web */ "t"], "defaultDocumentLibrary", _types_js__WEBPACK_IMPORTED_MODULE_2__[/* List */ "e"]);
Object(_pnp_queryable__WEBPACK_IMPORTED_MODULE_0__[/* addProp */ "c"])(_webs_types_js__WEBPACK_IMPORTED_MODULE_1__[/* _Web */ "t"], "customListTemplates", _spqueryable_js__WEBPACK_IMPORTED_MODULE_4__[/* SPCollection */ "e"], "getcustomlisttemplates");
_webs_types_js__WEBPACK_IMPORTED_MODULE_1__[/* _Web */ "t"].prototype.getList = function (listRelativeUrl) {
    return Object(_types_js__WEBPACK_IMPORTED_MODULE_2__[/* List */ "e"])(this, `getList('${Object(_utils_encode_path_str_js__WEBPACK_IMPORTED_MODULE_5__[/* encodePath */ "e"])(listRelativeUrl)}')`);
};
_webs_types_js__WEBPACK_IMPORTED_MODULE_1__[/* _Web */ "t"].prototype.getCatalog = async function (type) {
    const data = await Object(_webs_types_js__WEBPACK_IMPORTED_MODULE_1__[/* Web */ "e"])(this, `getcatalog(${type})`).select("Id")();
    return Object(_types_js__WEBPACK_IMPORTED_MODULE_2__[/* List */ "e"])([this, Object(_utils_odata_url_from_js__WEBPACK_IMPORTED_MODULE_3__[/* odataUrlFrom */ "e"])(data)]);
};
//# sourceMappingURL=web.js.map

/***/ }),

/***/ "DUND":
/*!**************************************************************!*\
  !*** ./lib/webparts/auresApp/components/hr/HRReviewQueue.js ***!
  \**************************************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "cDcd");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../AuresApp.module.scss */ "sg2l");
/* harmony import */ var _services_interfaces__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../services/interfaces */ "FFPM");
/* harmony import */ var _services_MentoringService__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../services/MentoringService */ "39m/");
/* harmony import */ var _utils_mockData__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../utils/mockData */ "IxoJ");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};





var HRReviewQueue = function (_a) {
    var sp = _a.sp;
    var _b = react__WEBPACK_IMPORTED_MODULE_0__["useState"]([]), requests = _b[0], setRequests = _b[1];
    var _c = react__WEBPACK_IMPORTED_MODULE_0__["useState"](true), loading = _c[0], setLoading = _c[1];
    var _d = react__WEBPACK_IMPORTED_MODULE_0__["useState"](null), processing = _d[0], setProcessing = _d[1];
    react__WEBPACK_IMPORTED_MODULE_0__["useEffect"](function () {
        new _services_MentoringService__WEBPACK_IMPORTED_MODULE_3__[/* MentoringService */ "e"](sp).getAllRequests()
            .then(function (all) { return setRequests(all.filter(function (r) { return r.RequestStatus === _services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* RequestStatus */ "e"].HR_Review; })); })
            .catch(function () { return setRequests(_utils_mockData__WEBPACK_IMPORTED_MODULE_4__[/* MOCK_REQUESTS */ "t"].filter(function (r) { return r.RequestStatus === _services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* RequestStatus */ "e"].HR_Review; })); })
            .finally(function () { return setLoading(false); });
    }, [sp]);
    var handleAction = function (reqId, newStatus) { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setProcessing(reqId);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, new _services_MentoringService__WEBPACK_IMPORTED_MODULE_3__[/* MentoringService */ "e"](sp).setRequestStatus(reqId, newStatus)];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = _b.sent();
                    return [3 /*break*/, 4];
                case 4:
                    setRequests(function (prev) { return prev.filter(function (r) { return r.Id !== reqId; }); });
                    setProcessing(null);
                    return [2 /*return*/];
            }
        });
    }); };
    if (loading)
        return react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].loading }, "Na\u010D\u00EDt\u00E1m HR frontu\u2026");
    return (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", null,
        react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("h2", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].pageTitle },
            "HR Fronta (",
            requests.length,
            ")"),
        react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("p", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].sectionHint }, "\u017D\u00E1dosti odm\u00EDtnut\u00E9 v\u0161emi mentory \u2014 vy\u017Eaduj\u00ED ru\u010Dn\u00ED \u0159e\u0161en\u00ED HR."),
        requests.length === 0 ? (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].emptyState },
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("p", null, "Fronta je pr\u00E1zdn\u00E1. \u017D\u00E1dn\u00E9 \u017E\u00E1dosti ne\u010Dekaj\u00ED na HR."))) : (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].requestList }, requests.map(function (req) {
            var isProcessing = processing === req.Id;
            var mentors = [req.Mentor1Ref, req.Mentor2Ref, req.Mentor3Ref].filter(Boolean);
            return (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { key: req.Id, className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].hrReviewCard },
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].hrReviewHeader },
                    react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("span", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].requestTitle }, req.Title),
                    react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("span", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].talentName }, req.TalentRef.Title)),
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].requestMentors }, mentors.map(function (m, i) { return m && (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("span", { key: i, className: [_AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].mentorTag, _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].mentorTagRejected].join(' ') },
                    "#",
                    i + 1,
                    " ",
                    m.Title)); })),
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].hrActionsBar },
                    react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("button", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].btnApprove, disabled: isProcessing, onClick: function () { void handleAction(req.Id, _services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* RequestStatus */ "e"].Scheduled); } }, "Napl\u00E1novat"),
                    react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("button", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].btnReject, disabled: isProcessing, onClick: function () { void handleAction(req.Id, _services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* RequestStatus */ "e"].Cancelled); } }, "Zru\u0161it \u017E\u00E1dost"))));
        })))));
};
/* harmony default export */ __webpack_exports__["e"] = (HRReviewQueue);


/***/ }),

/***/ "DZog":
/*!*******************************************!*\
  !*** ./node_modules/@pnp/core/moments.js ***!
  \*******************************************/
/*! exports provided: broadcast, asyncBroadcast, reduce, asyncReduce, request, lifecycle */
/*! exports used: asyncBroadcast, asyncReduce, broadcast, lifecycle, reduce, request */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return broadcast; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return asyncBroadcast; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return reduce; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "t", function() { return asyncReduce; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "r", function() { return request; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return lifecycle; });
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util.js */ "NuLX");

/**
 * Emits to all registered observers the supplied arguments. Any values returned by the observers are ignored
 *
 * @returns void
 */
function broadcast() {
    return function (observers, ...args) {
        const obs = [...observers];
        for (let i = 0; i < obs.length; i++) {
            Reflect.apply(obs[i], this, args);
        }
    };
}
/**
 * Defines a moment that executes each observer asynchronously in parallel awaiting all promises to resolve or reject before continuing
 *
 * @returns The final set of arguments
 */
function asyncBroadcast() {
    return async function (observers, ...args) {
        // get our initial values
        const r = args;
        const obs = [...observers];
        const promises = [];
        for (let i = 0; i < obs.length; i++) {
            promises.push(Reflect.apply(obs[i], this, r));
        }
        return Promise.all(promises);
    };
}
/**
 * Defines a moment that executes each observer synchronously, passing the returned arguments as the arguments to the next observer.
 * This is very much like the redux pattern taking the arguments as the state which each observer may modify then returning a new state
 *
 * @returns The final set of arguments
 */
function reduce() {
    return function (observers, ...args) {
        const obs = [...observers];
        return obs.reduce((params, func) => Reflect.apply(func, this, params), args);
    };
}
/**
 * Defines a moment that executes each observer asynchronously, awaiting the result and passes the returned arguments as the arguments to the next observer.
 * This is very much like the redux pattern taking the arguments as the state which each observer may modify then returning a new state
 *
 * @returns The final set of arguments
 */
function asyncReduce() {
    return async function (observers, ...args) {
        const obs = [...observers];
        return obs.reduce((prom, func) => prom.then((params) => Reflect.apply(func, this, params)), Promise.resolve(args));
    };
}
/**
 * Defines a moment where the first registered observer is used to asynchronously execute a request, returning a single result
 * If no result is returned (undefined) no further action is taken and the result will be undefined (i.e. additional observers are not used)
 *
 * @returns The result returned by the first registered observer
 */
function request() {
    return async function (observers, ...args) {
        if (!Object(_util_js__WEBPACK_IMPORTED_MODULE_0__[/* isArray */ "o"])(observers) || observers.length < 1) {
            return undefined;
        }
        const handler = observers[0];
        return Reflect.apply(handler, this, args);
    };
}
/**
 * Defines a special moment used to configure the timeline itself before starting. Each observer is executed in order,
 * possibly modifying the "this" instance, with the final product returned
 *
 */
function lifecycle() {
    return function (observers, ...args) {
        const obs = [...observers];
        // process each handler which updates our instance in order
        // very similar to asyncReduce but the state is the object itself
        for (let i = 0; i < obs.length; i++) {
            Reflect.apply(obs[i], this, args);
        }
        return this;
    };
}
//# sourceMappingURL=moments.js.map

/***/ }),

/***/ "DnXt":
/*!*****************************************!*\
  !*** external "AuresAppWebPartStrings" ***!
  \*****************************************/
/*! no static exports found */
/*! exports used: BasicGroupName, DescriptionFieldLabel, PropertyPaneDescription */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_DnXt__;

/***/ }),

/***/ "EjWy":
/*!************************************************!*\
  !*** ./node_modules/@pnp/sp/site-users/web.js ***!
  \************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _pnp_queryable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @pnp/queryable */ "Ymo3");
/* harmony import */ var _webs_types_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../webs/types.js */ "dVsc");
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./types.js */ "y+KB");
/* harmony import */ var _spqueryable_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../spqueryable.js */ "F4qD");




Object(_pnp_queryable__WEBPACK_IMPORTED_MODULE_0__[/* addProp */ "c"])(_webs_types_js__WEBPACK_IMPORTED_MODULE_1__[/* _Web */ "t"], "siteUsers", _types_js__WEBPACK_IMPORTED_MODULE_2__[/* SiteUsers */ "t"]);
Object(_pnp_queryable__WEBPACK_IMPORTED_MODULE_0__[/* addProp */ "c"])(_webs_types_js__WEBPACK_IMPORTED_MODULE_1__[/* _Web */ "t"], "currentUser", _types_js__WEBPACK_IMPORTED_MODULE_2__[/* SiteUser */ "e"]);
_webs_types_js__WEBPACK_IMPORTED_MODULE_1__[/* _Web */ "t"].prototype.ensureUser = async function (logonName) {
    return Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_3__[/* spPost */ "d"])(Object(_webs_types_js__WEBPACK_IMPORTED_MODULE_1__[/* Web */ "e"])(this, "ensureuser"), Object(_pnp_queryable__WEBPACK_IMPORTED_MODULE_0__[/* body */ "d"])({ logonName }));
};
_webs_types_js__WEBPACK_IMPORTED_MODULE_1__[/* _Web */ "t"].prototype.getUserById = function (id) {
    return Object(_types_js__WEBPACK_IMPORTED_MODULE_2__[/* SiteUser */ "e"])(this, `getUserById(${id})`);
};
//# sourceMappingURL=web.js.map

/***/ }),

/***/ "F4qD":
/*!*********************************************!*\
  !*** ./node_modules/@pnp/sp/spqueryable.js ***!
  \*********************************************/
/*! exports provided: spInvokableFactory, _SPQueryable, SPQueryable, _SPCollection, SPCollection, _SPInstance, SPInstance, deleteable, deleteableWithETag, spGet, spPost, spPostMerge, spPostDelete, spPostDeleteETag, spDelete, spPatch, InitialFieldQuery, ComparisonResult */
/*! exports used: SPCollection, SPInstance, SPQueryable, _SPCollection, _SPInstance, _SPQueryable, deleteable, deleteableWithETag, spInvokableFactory, spPost, spPostMerge */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return spInvokableFactory; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "r", function() { return _SPQueryable; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return SPQueryable; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return _SPCollection; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return SPCollection; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return _SPInstance; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "t", function() { return SPInstance; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "o", function() { return deleteable; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "s", function() { return deleteableWithETag; });
/* unused harmony export spGet */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return spPost; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return spPostMerge; });
/* unused harmony export spPostDelete */
/* unused harmony export spPostDeleteETag */
/* unused harmony export spDelete */
/* unused harmony export spPatch */
/* unused harmony export InitialFieldQuery */
/* unused harmony export ComparisonResult */
/* harmony import */ var _pnp_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @pnp/core */ "JC1J");
/* harmony import */ var _pnp_queryable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @pnp/queryable */ "Ymo3");


const spInvokableFactory = (f) => {
    return Object(_pnp_queryable__WEBPACK_IMPORTED_MODULE_1__[/* queryableFactory */ "g"])(f);
};
/**
 * SharePointQueryable Base Class
 *
 */
class _SPQueryable extends _pnp_queryable__WEBPACK_IMPORTED_MODULE_1__[/* Queryable */ "i"] {
    /**
     * Creates a new instance of the SharePointQueryable class
     *
     * @constructor
     * @param base A string or SharePointQueryable that should form the base part of the url
     *
     */
    constructor(base, path) {
        if (typeof base === "string") {
            let url = "";
            let parentUrl = "";
            // we need to do some extra parsing to get the parent url correct if we are
            // being created from just a string.
            if (Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* isUrlAbsolute */ "m"])(base) || base.lastIndexOf("/") < 0) {
                parentUrl = base;
                url = Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* combine */ "o"])(base, path);
            }
            else if (base.lastIndexOf("/") > base.lastIndexOf("(")) {
                // .../items(19)/fields
                const index = base.lastIndexOf("/");
                parentUrl = base.slice(0, index);
                path = Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* combine */ "o"])(base.slice(index), path);
                url = Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* combine */ "o"])(parentUrl, path);
            }
            else {
                // .../items(19)
                const index = base.lastIndexOf("(");
                parentUrl = base.slice(0, index);
                url = Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* combine */ "o"])(base, path);
            }
            // init base with corrected string value
            super(url);
            this.parentUrl = parentUrl;
        }
        else {
            super(base, path);
            const q = Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* isArray */ "f"])(base) ? base[0] : base;
            this.parentUrl = Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* isArray */ "f"])(base) ? base[1] : q.toUrl();
        }
    }
    /**
     * Gets the full url with query information
     */
    toRequestUrl() {
        const aliasedParams = new URLSearchParams(this.query);
        // this regex is designed to locate aliased parameters within url paths
        let url = this.toUrl().replace(/'!(@.+?)::((?:[^']|'')+)'/ig, (match, labelName, value) => {
            this.log(`Rewriting aliased parameter from match ${match} to label: ${labelName} value: ${value}`, 0);
            aliasedParams.set(labelName, `'${value}'`);
            return labelName;
        });
        const query = aliasedParams.toString();
        if (!Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* stringIsNullOrEmpty */ "S"])(query)) {
            url += `${url.indexOf("?") > -1 ? "&" : "?"}${query}`;
        }
        return url;
    }
    /**
     * Choose which fields to return
     *
     * @param selects One or more fields to return
     */
    select(...selects) {
        if (selects.length > 0) {
            this.query.set("$select", selects.join(","));
        }
        return this;
    }
    /**
     * Expands fields such as lookups to get additional data
     *
     * @param expands The Fields for which to expand the values
     */
    expand(...expands) {
        if (expands.length > 0) {
            this.query.set("$expand", expands.join(","));
        }
        return this;
    }
    /**
     * Gets a parent for this instance as specified
     *
     * @param factory The contructor for the class to create
     */
    getParent(factory, path, base = this.parentUrl) {
        return factory([this, base], path);
    }
}
const SPQueryable = spInvokableFactory(_SPQueryable);
/**
 * Represents a REST collection which can be filtered, paged, and selected
 *
 */
class _SPCollection extends _SPQueryable {
    /**
     * Filters the returned collection (https://msdn.microsoft.com/en-us/library/office/fp142385.aspx#bk_supported)
     *
     * @param filter The string representing the filter query
     */
    filter(filter) {
        if (typeof filter === "object") {
            this.query.set("$filter", filter.toString());
            return this;
        }
        if (typeof filter === "function") {
            this.query.set("$filter", filter(SPOData.Where()).toString());
            return this;
        }
        this.query.set("$filter", filter.toString());
        return this;
    }
    /**
     * Orders based on the supplied fields
     *
     * @param orderby The name of the field on which to sort
     * @param ascending If false DESC is appended, otherwise ASC (default)
     */
    orderBy(orderBy, ascending = true) {
        const o = "$orderby";
        const query = this.query.has(o) ? this.query.get(o).split(",") : [];
        query.push(`${orderBy} ${ascending ? "asc" : "desc"}`);
        this.query.set(o, query.join(","));
        return this;
    }
    /**
     * Skips the specified number of items
     *
     * @param skip The number of items to skip
     */
    skip(skip) {
        this.query.set("$skip", skip.toString());
        return this;
    }
    /**
     * Limits the query to only return the specified number of items
     *
     * @param top The query row limit
     */
    top(top) {
        this.query.set("$top", top.toString());
        return this;
    }
}
const SPCollection = spInvokableFactory(_SPCollection);
/**
 * Represents an instance that can be selected
 *
 */
class _SPInstance extends _SPQueryable {
}
const SPInstance = spInvokableFactory(_SPInstance);
/**
 * Adds the a delete method to the tagged class taking no parameters and calling spPostDelete
 */
function deleteable() {
    return function () {
        return spPostDelete(this);
    };
}
function deleteableWithETag() {
    return function (eTag = "*") {
        return spPostDeleteETag(this, {}, eTag);
    };
}
const spGet = (o, init) => {
    return Object(_pnp_queryable__WEBPACK_IMPORTED_MODULE_1__[/* op */ "p"])(o, _pnp_queryable__WEBPACK_IMPORTED_MODULE_1__[/* get */ "u"], init);
};
const spPost = (o, init) => Object(_pnp_queryable__WEBPACK_IMPORTED_MODULE_1__[/* op */ "p"])(o, _pnp_queryable__WEBPACK_IMPORTED_MODULE_1__[/* post */ "b"], init);
const spPostMerge = (o, init) => {
    init = init || {};
    init.headers = { ...init.headers, "X-HTTP-Method": "MERGE" };
    return spPost(o, init);
};
const spPostDelete = (o, init) => {
    init = init || {};
    init.headers = { ...init.headers || {}, "X-HTTP-Method": "DELETE" };
    return spPost(o, init);
};
const spPostDeleteETag = (o, init, eTag = "*") => {
    init = init || {};
    init.headers = { ...init.headers || {}, "IF-Match": eTag };
    return spPostDelete(o, init);
};
const spDelete = (o, init) => Object(_pnp_queryable__WEBPACK_IMPORTED_MODULE_1__[/* op */ "p"])(o, _pnp_queryable__WEBPACK_IMPORTED_MODULE_1__[/* del */ "l"], init);
const spPatch = (o, init) => Object(_pnp_queryable__WEBPACK_IMPORTED_MODULE_1__[/* op */ "p"])(o, _pnp_queryable__WEBPACK_IMPORTED_MODULE_1__[/* patch */ "h"], init);
var FilterOperation;
(function (FilterOperation) {
    FilterOperation["Equals"] = "eq";
    FilterOperation["NotEquals"] = "ne";
    FilterOperation["GreaterThan"] = "gt";
    FilterOperation["GreaterThanOrEqualTo"] = "ge";
    FilterOperation["LessThan"] = "lt";
    FilterOperation["LessThanOrEqualTo"] = "le";
    FilterOperation["StartsWith"] = "startswith";
    FilterOperation["SubstringOf"] = "substringof";
})(FilterOperation || (FilterOperation = {}));
var FilterJoinOperator;
(function (FilterJoinOperator) {
    FilterJoinOperator["And"] = "and";
    FilterJoinOperator["AndWithSpace"] = " and ";
    FilterJoinOperator["Or"] = "or";
    FilterJoinOperator["OrWithSpace"] = " or ";
})(FilterJoinOperator || (FilterJoinOperator = {}));
class SPOData {
    static Where() {
        return new InitialFieldQuery([]);
    }
}
// Linting complains that TBaseInterface is unused, but without it all the intellisense is lost since it's carrying it through the chain
class BaseQuery {
    constructor(query) {
        this.query = [];
        this.query = query;
    }
}
class QueryableFields extends BaseQuery {
    constructor(q) {
        super(q);
    }
    text(internalName) {
        return new TextField([...this.query, internalName]);
    }
    choice(internalName) {
        return new TextField([...this.query, internalName]);
    }
    multiChoice(internalName) {
        return new TextField([...this.query, internalName]);
    }
    number(internalName) {
        return new NumberField([...this.query, internalName]);
    }
    date(internalName) {
        return new DateField([...this.query, internalName]);
    }
    boolean(internalName) {
        return new BooleanField([...this.query, internalName]);
    }
    lookup(internalName) {
        return new LookupQueryableFields([...this.query], internalName);
    }
    lookupId(internalName) {
        const col = internalName.endsWith("Id") ? internalName : `${internalName}Id`;
        return new NumberField([...this.query, col]);
    }
}
class QueryableAndResult extends QueryableFields {
    or(...queries) {
        return new ComparisonResult([...this.query, `(${queries.map(x => x.toString()).join(FilterJoinOperator.OrWithSpace)})`]);
    }
}
class QueryableOrResult extends QueryableFields {
    and(...queries) {
        return new ComparisonResult([...this.query, `(${queries.map(x => x.toString()).join(FilterJoinOperator.AndWithSpace)})`]);
    }
}
class InitialFieldQuery extends QueryableFields {
    or(...queries) {
        if (queries == null || queries.length === 0) {
            return new QueryableFields([...this.query, FilterJoinOperator.Or]);
        }
        return new ComparisonResult([...this.query, `(${queries.map(x => x.toString()).join(FilterJoinOperator.OrWithSpace)})`]);
    }
    and(...queries) {
        if (queries == null || queries.length === 0) {
            return new QueryableFields([...this.query, FilterJoinOperator.And]);
        }
        return new ComparisonResult([...this.query, `(${queries.map(x => x.toString()).join(FilterJoinOperator.AndWithSpace)})`]);
    }
}
class LookupQueryableFields extends BaseQuery {
    constructor(q, LookupField) {
        super(q);
        this.LookupField = LookupField;
    }
    Id(id) {
        return new ComparisonResult([...this.query, `${this.LookupField}/Id`, FilterOperation.Equals, id.toString()]);
    }
    text(internalName) {
        return new TextField([...this.query, `${this.LookupField}/${internalName}`]);
    }
    number(internalName) {
        return new NumberField([...this.query, `${this.LookupField}/${internalName}`]);
    }
}
class NullableField extends BaseQuery {
    constructor(q) {
        super(q);
        this.LastIndex = q.length - 1;
        this.InternalName = q[this.LastIndex];
    }
    toODataValue(value) {
        return `'${value}'`;
    }
    isNull() {
        return new ComparisonResult([...this.query, FilterOperation.Equals, "null"]);
    }
    isNotNull() {
        return new ComparisonResult([...this.query, FilterOperation.NotEquals, "null"]);
    }
}
class ComparableField extends NullableField {
    equals(value) {
        return new ComparisonResult([...this.query, FilterOperation.Equals, this.toODataValue(value)]);
    }
    notEquals(value) {
        return new ComparisonResult([...this.query, FilterOperation.NotEquals, this.toODataValue(value)]);
    }
    in(...values) {
        return SPOData.Where().or(...values.map(x => this.equals(x)));
    }
    notIn(...values) {
        return SPOData.Where().and(...values.map(x => this.notEquals(x)));
    }
}
class TextField extends ComparableField {
    startsWith(value) {
        const filter = `${FilterOperation.StartsWith}(${this.InternalName}, ${this.toODataValue(value)})`;
        this.query[this.LastIndex] = filter;
        return new ComparisonResult([...this.query]);
    }
    contains(value) {
        const filter = `${FilterOperation.SubstringOf}(${this.toODataValue(value)}, ${this.InternalName})`;
        this.query[this.LastIndex] = filter;
        return new ComparisonResult([...this.query]);
    }
}
class BooleanField extends NullableField {
    toODataValue(value) {
        return `${value == null ? "null" : value ? 1 : 0}`;
    }
    isTrue() {
        return new ComparisonResult([...this.query, FilterOperation.Equals, this.toODataValue(true)]);
    }
    isFalse() {
        return new ComparisonResult([...this.query, FilterOperation.Equals, this.toODataValue(false)]);
    }
    isFalseOrNull() {
        const filter = `(${[
            this.InternalName,
            FilterOperation.Equals,
            this.toODataValue(null),
            FilterJoinOperator.Or,
            this.InternalName,
            FilterOperation.Equals,
            this.toODataValue(false),
        ].join(" ")})`;
        this.query[this.LastIndex] = filter;
        return new ComparisonResult([...this.query]);
    }
}
class NumericField extends ComparableField {
    greaterThan(value) {
        return new ComparisonResult([...this.query, FilterOperation.GreaterThan, this.toODataValue(value)]);
    }
    greaterThanOrEquals(value) {
        return new ComparisonResult([...this.query, FilterOperation.GreaterThanOrEqualTo, this.toODataValue(value)]);
    }
    lessThan(value) {
        return new ComparisonResult([...this.query, FilterOperation.LessThan, this.toODataValue(value)]);
    }
    lessThanOrEquals(value) {
        return new ComparisonResult([...this.query, FilterOperation.LessThanOrEqualTo, this.toODataValue(value)]);
    }
}
class NumberField extends NumericField {
    toODataValue(value) {
        return `${value}`;
    }
}
class DateField extends NumericField {
    toODataValue(value) {
        return `'${value.toISOString()}'`;
    }
    isBetween(startDate, endDate) {
        const filter = `(${[
            this.InternalName,
            FilterOperation.GreaterThan,
            this.toODataValue(startDate),
            FilterJoinOperator.And,
            this.InternalName,
            FilterOperation.LessThan,
            this.toODataValue(endDate),
        ].join(" ")})`;
        this.query[this.LastIndex] = filter;
        return new ComparisonResult([...this.query]);
    }
    isToday() {
        const StartToday = new Date();
        StartToday.setHours(0, 0, 0, 0);
        const EndToday = new Date();
        EndToday.setHours(23, 59, 59, 999);
        return this.isBetween(StartToday, EndToday);
    }
}
class ComparisonResult extends BaseQuery {
    // eslint-disable-next-line max-len
    and(...queries) {
        if (queries == null || queries.length === 0) {
            return new QueryableAndResult([...this.query, FilterJoinOperator.And]);
        }
        return new ComparisonResult([...this.query, FilterJoinOperator.And, `(${queries.map(x => x.toString()).join(FilterJoinOperator.AndWithSpace)})`]);
    }
    // eslint-disable-next-line max-len
    or(...queries) {
        if (queries == null || queries.length === 0) {
            return new QueryableOrResult([...this.query, FilterJoinOperator.Or]);
        }
        return new ComparisonResult([...this.query, FilterJoinOperator.Or, `(${queries.map(x => x.toString()).join(FilterJoinOperator.OrWithSpace)})`]);
    }
    toString() {
        return this.query.join(" ");
    }
}
//# sourceMappingURL=spqueryable.js.map

/***/ }),

/***/ "FFPM":
/*!************************************!*\
  !*** ./lib/services/interfaces.js ***!
  \************************************/
/*! exports provided: RequestStatus, StageDecision, UserRole */
/*! exports used: RequestStatus, StageDecision, UserRole */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return RequestStatus; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "t", function() { return StageDecision; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return UserRole; });
// ============================================================
// Enums
// ============================================================
var RequestStatus;
(function (RequestStatus) {
    RequestStatus["Pending"] = "Pending";
    RequestStatus["Approved"] = "Approved";
    RequestStatus["HR_Review"] = "HR_Review";
    RequestStatus["Scheduled"] = "Scheduled";
    RequestStatus["Cancelled"] = "Cancelled";
})(RequestStatus || (RequestStatus = {}));
var StageDecision;
(function (StageDecision) {
    StageDecision["Approved"] = "Approved";
    StageDecision["Rejected"] = "Rejected";
})(StageDecision || (StageDecision = {}));
var UserRole;
(function (UserRole) {
    UserRole["Talent"] = "Talent";
    UserRole["Mentor"] = "Mentor";
    UserRole["HR"] = "HR";
    UserRole["Unknown"] = "Unknown";
})(UserRole || (UserRole = {}));


/***/ }),

/***/ "G6u6":
/*!********************************************************!*\
  !*** ./node_modules/@pnp/sp/utils/to-resource-path.js ***!
  \********************************************************/
/*! exports provided: toResourcePath */
/*! exports used: toResourcePath */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return toResourcePath; });
function toResourcePath(url) {
    return {
        DecodedUrl: url,
    };
}
//# sourceMappingURL=to-resource-path.js.map

/***/ }),

/***/ "GfGO":
/*!**********************************************************!*\
  !*** ./node_modules/@pnp/sp/behaviors/request-digest.js ***!
  \**********************************************************/
/*! exports provided: RequestDigest */
/*! exports used: RequestDigest */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return RequestDigest; });
/* harmony import */ var _pnp_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @pnp/core */ "JC1J");
/* harmony import */ var _pnp_queryable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @pnp/queryable */ "Ymo3");
/* harmony import */ var _utils_extract_web_url_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/extract-web-url.js */ "OXUt");
/* harmony import */ var _spqueryable_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../spqueryable.js */ "F4qD");
/* harmony import */ var _batching_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../batching.js */ "pAcn");





function clearExpired(digest) {
    const now = new Date();
    return !Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* objectDefinedNotNull */ "g"])(digest) || (now > digest.expiration) ? null : digest;
}
// allows for the caching of digests across all calls which each have their own IDigestInfo wrapper.
const digests = new Map();
function RequestDigest(hook) {
    return (instance) => {
        instance.on.pre(async function (url, init, result) {
            // add the request to the auth moment of the timeline
            this.on.auth(async (url, init) => {
                // eslint-disable-next-line max-len
                if (/get/i.test(init.method) || (init.headers && (Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* hOP */ "u"])(init.headers, "X-RequestDigest") || Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* hOP */ "u"])(init.headers, "Authorization") || Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* hOP */ "u"])(init.headers, "X-PnPjs-NoDigest")))) {
                    return [url, init];
                }
                const urlAsString = url.toString();
                const webUrl = Object(_utils_extract_web_url_js__WEBPACK_IMPORTED_MODULE_2__[/* extractWebUrl */ "e"])(urlAsString);
                // do we have one in the cache that is still valid
                // from #2186 we need to always ensure the digest we get isn't expired
                let digest = clearExpired(digests.get(webUrl));
                if (!Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* objectDefinedNotNull */ "g"])(digest) && Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* isFunc */ "p"])(hook)) {
                    digest = clearExpired(hook(urlAsString, init));
                }
                if (!Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* objectDefinedNotNull */ "g"])(digest)) {
                    digest = await Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_3__[/* spPost */ "d"])(Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_3__[/* SPQueryable */ "n"])([this, Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* combine */ "o"])(webUrl, "_api/contextinfo")]).using(Object(_pnp_queryable__WEBPACK_IMPORTED_MODULE_1__[/* JSONParse */ "a"])(), Object(_batching_js__WEBPACK_IMPORTED_MODULE_4__[/* BatchNever */ "e"])()), {
                        headers: {
                            "Accept": "application/json",
                            "X-PnPjs-NoDigest": "1",
                        },
                    }).then(p => ({
                        expiration: Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* dateAdd */ "s"])(new Date(), "second", p.FormDigestTimeoutSeconds),
                        value: p.FormDigestValue,
                    }));
                }
                if (Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* objectDefinedNotNull */ "g"])(digest)) {
                    // if we got a digest, set it in the headers
                    init.headers = {
                        "X-RequestDigest": digest.value,
                        ...init.headers,
                    };
                    // and cache it for future requests
                    digests.set(webUrl, digest);
                }
                return [url, init];
            });
            return [url, init, result];
        });
        return instance;
    };
}
//# sourceMappingURL=request-digest.js.map

/***/ }),

/***/ "ISfK":
/*!**********************************************************!*\
  !*** ./node_modules/@pnp/queryable/behaviors/timeout.js ***!
  \**********************************************************/
/*! exports provided: Timeout */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export Timeout */
/**
 * Behavior that will cause a timeout in the request after the specified milliseconds
 *
 * @param timeout Number of milliseconds to set the timeout
 */
function Timeout(timeout) {
    return (instance) => {
        instance.on.pre(async (url, init, result) => {
            const controller = new AbortController();
            init.signal = controller.signal;
            setTimeout(() => controller.abort(), timeout);
            return [url, init, result];
        });
        return instance;
    };
}
//# sourceMappingURL=timeout.js.map

/***/ }),

/***/ "IwJs":
/*!*********************************************************************!*\
  !*** ./node_modules/@pnp/queryable/node_modules/tslib/tslib.es6.js ***!
  \*********************************************************************/
/*! exports provided: __extends, __assign, __rest, __decorate, __param, __esDecorate, __runInitializers, __propKey, __setFunctionName, __metadata, __awaiter, __generator, __createBinding, __exportStar, __values, __read, __spread, __spreadArrays, __spreadArray, __await, __asyncGenerator, __asyncDelegator, __asyncValues, __makeTemplateObject, __importStar, __importDefault, __classPrivateFieldGet, __classPrivateFieldSet, __classPrivateFieldIn, __addDisposableResource, __disposeResources, __rewriteRelativeImportExtension, default */
/*! exports used: __decorate */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export __extends */
/* unused harmony export __assign */
/* unused harmony export __rest */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return __decorate; });
/* unused harmony export __param */
/* unused harmony export __esDecorate */
/* unused harmony export __runInitializers */
/* unused harmony export __propKey */
/* unused harmony export __setFunctionName */
/* unused harmony export __metadata */
/* unused harmony export __awaiter */
/* unused harmony export __generator */
/* unused harmony export __createBinding */
/* unused harmony export __exportStar */
/* unused harmony export __values */
/* unused harmony export __read */
/* unused harmony export __spread */
/* unused harmony export __spreadArrays */
/* unused harmony export __spreadArray */
/* unused harmony export __await */
/* unused harmony export __asyncGenerator */
/* unused harmony export __asyncDelegator */
/* unused harmony export __asyncValues */
/* unused harmony export __makeTemplateObject */
/* unused harmony export __importStar */
/* unused harmony export __importDefault */
/* unused harmony export __classPrivateFieldGet */
/* unused harmony export __classPrivateFieldSet */
/* unused harmony export __classPrivateFieldIn */
/* unused harmony export __addDisposableResource */
/* unused harmony export __disposeResources */
/* unused harmony export __rewriteRelativeImportExtension */
/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __esDecorate(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};

function __runInitializers(thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};

function __propKey(x) {
    return typeof x === "symbol" ? x : "".concat(x);
};

function __setFunctionName(f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var __createBinding = Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});

function __exportStar(m, o) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

/** @deprecated */
function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

/** @deprecated */
function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
    function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
    function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

var __setModuleDefault = Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
};

var ownKeys = function(o) {
    ownKeys = Object.getOwnPropertyNames || function (o) {
        var ar = [];
        for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
        return ar;
    };
    return ownKeys(o);
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
    __setModuleDefault(result, mod);
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

function __classPrivateFieldIn(state, receiver) {
    if (receiver === null || (typeof receiver !== "object" && typeof receiver !== "function")) throw new TypeError("Cannot use 'in' operator on non-object");
    return typeof state === "function" ? receiver === state : state.has(receiver);
}

function __addDisposableResource(env, value, async) {
    if (value !== null && value !== void 0) {
        if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
        var dispose, inner;
        if (async) {
            if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
            dispose = value[Symbol.asyncDispose];
        }
        if (dispose === void 0) {
            if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
            dispose = value[Symbol.dispose];
            if (async) inner = dispose;
        }
        if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
        if (inner) dispose = function() { try { inner.call(this); } catch (e) { return Promise.reject(e); } };
        env.stack.push({ value: value, dispose: dispose, async: async });
    }
    else if (async) {
        env.stack.push({ async: true });
    }
    return value;

}

var _SuppressedError = typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

function __disposeResources(env) {
    function fail(e) {
        env.error = env.hasError ? new _SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
        env.hasError = true;
    }
    var r, s = 0;
    function next() {
        while (r = env.stack.pop()) {
            try {
                if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
                if (r.dispose) {
                    var result = r.dispose.call(r.value);
                    if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
                }
                else s |= 1;
            }
            catch (e) {
                fail(e);
            }
        }
        if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
        if (env.hasError) throw env.error;
    }
    return next();
}

function __rewriteRelativeImportExtension(path, preserveJsx) {
    if (typeof path === "string" && /^\.\.?\//.test(path)) {
        return path.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function (m, tsx, d, ext, cm) {
            return tsx ? preserveJsx ? ".jsx" : ".js" : d && (!ext || !cm) ? m : (d + ext + "." + cm.toLowerCase() + "js");
        });
    }
    return path;
}

/* unused harmony default export */ var _unused_webpack_default_export = ({
    __extends: __extends,
    __assign: __assign,
    __rest: __rest,
    __decorate: __decorate,
    __param: __param,
    __esDecorate: __esDecorate,
    __runInitializers: __runInitializers,
    __propKey: __propKey,
    __setFunctionName: __setFunctionName,
    __metadata: __metadata,
    __awaiter: __awaiter,
    __generator: __generator,
    __createBinding: __createBinding,
    __exportStar: __exportStar,
    __values: __values,
    __read: __read,
    __spread: __spread,
    __spreadArrays: __spreadArrays,
    __spreadArray: __spreadArray,
    __await: __await,
    __asyncGenerator: __asyncGenerator,
    __asyncDelegator: __asyncDelegator,
    __asyncValues: __asyncValues,
    __makeTemplateObject: __makeTemplateObject,
    __importStar: __importStar,
    __importDefault: __importDefault,
    __classPrivateFieldGet: __classPrivateFieldGet,
    __classPrivateFieldSet: __classPrivateFieldSet,
    __classPrivateFieldIn: __classPrivateFieldIn,
    __addDisposableResource: __addDisposableResource,
    __disposeResources: __disposeResources,
    __rewriteRelativeImportExtension: __rewriteRelativeImportExtension,
});


/***/ }),

/***/ "IxoJ":
/*!*******************************!*\
  !*** ./lib/utils/mockData.js ***!
  \*******************************/
/*! exports provided: MOCK_MENTORS, MOCK_TALENTS, MOCK_REQUESTS */
/*! exports used: MOCK_MENTORS, MOCK_REQUESTS, MOCK_TALENTS */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return MOCK_MENTORS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return MOCK_TALENTS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "t", function() { return MOCK_REQUESTS; });
/* harmony import */ var _services_interfaces__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../services/interfaces */ "FFPM");
/**
 * Mock data pro lokalni vyvoj (gulp serve bez SP Online pripojeni).
 * Pouzivano jako fallback kdyz SharePoint neni dostupny.
 */

var MOCK_MENTORS = [
    {
        Id: 1,
        Title: 'Karolína Topolová',
        MentorUser: { Id: 101, Title: 'Karolína Topolová', EMail: 'karolina.topolova@aures.cz' },
        JobTitle: 'co-CEO',
        Superpower: 'Networking, change management, schopnost ovlivňovat a propojovat lidi',
        Bio: 'Karolína Topolová začala svou kariéru v roce 1998 založením firemního call centra, které tehdy tvořilo pět lidí a postupně vyrostlo v profesionální tým s více než 200 zaměstnanci. Během své kariéry prošla řadou manažerských rolí napříč oblastmi sales, financování, HR i externí komunikace. Díky této zkušenosti získala komplexní pohled na fungování firmy a její růst. V roce 2012 se stala Generální ředitelkou společnosti, a o tři roky později také Předsedkyní představenstva.\n\nNejvětší překonaná výzva: Úspěšně provést firmu zásadní transformací v období ekonomické krize a pandemie COVID-19.',
        Capacity: 2,
        AvailabilityNote: '',
        PhotoUrl: '',
        IsActive: true
    },
    {
        Id: 2,
        Title: 'Petr Vaněček',
        MentorUser: { Id: 102, Title: 'Petr Vaněček', EMail: 'petr.vanecek@aures.cz' },
        JobTitle: 'co-CEO',
        Superpower: 'Schopnost proměňovat data a technologické inovace v konkrétní businessová řešení a růst firmy',
        Bio: 'Petr Vaněček ve společnosti působí více než dvě dekády a během této doby prošel řadou klíčových manažerských rolí napříč businessem. Díky hluboké znalosti fungování firmy i trhu se dlouhodobě podílí na jejím strategickém směřování a rozvoji. V roli Co-CEO se soustředí zejména na rozvoj businessu, digitalizaci, práci s daty a technologické inovace.\n\nNejvětší překonaná výzva: Krizový management za Covidu.',
        Capacity: 2,
        AvailabilityNote: '',
        PhotoUrl: '',
        IsActive: true
    },
    {
        Id: 3,
        Title: 'Luboš Vorlík',
        MentorUser: { Id: 103, Title: 'Luboš Vorlík', EMail: 'lubos.vorlik@aures.cz' },
        JobTitle: 'Managing Director CZ/SK',
        Superpower: 'Motivace a vedení týmu, orientace na výsledek, prezentační a komunikační dovednosti',
        Bio: 'Luboš Vorlík ve společnosti působí jako Výkonný ředitel pro Českou republiku a Slovensko, kde zodpovídá za strategické řízení a další rozvoj společnosti na obou trzích. Do firmy nastoupil v roce 2003 a během svého působení prošel řadou zákaznicky orientovaných pozic, což mu poskytlo hluboké porozumění potřebám klientů i fungování obchodních procesů.\n\nNejvětší překonaná výzva: Transformace sales departmentu na SK.',
        Capacity: 2,
        AvailabilityNote: '',
        PhotoUrl: '',
        IsActive: true
    },
    {
        Id: 4,
        Title: 'Martin Hrudník',
        MentorUser: { Id: 104, Title: 'Martin Hrudník', EMail: 'martin.hrudnik@aures.cz' },
        JobTitle: 'COO',
        Superpower: 'Schopnost přetavit detailní znalost operativy v efektivní strategii nákupu a růstu',
        Bio: 'Martin Hrudník působí ve společnosti jako COO a je zodpovědný za nákupní strategii společnosti, související marketingové aktivity a projekty podporující další expanzi skupiny. Do firmy nastoupil již v roce 1999 a během své kariéry prošel řadou pozic v oblasti nákupu a provozu.\n\nNejvětší překonaná výzva: Po 15 letech ve výkupní „bublině" převzetí odpovědnosti i za prodejní výsledky.',
        Capacity: 2,
        AvailabilityNote: '',
        PhotoUrl: '',
        IsActive: true
    },
    {
        Id: 5,
        Title: 'Daniel Luňáček',
        MentorUser: { Id: 105, Title: 'Daniel Luňáček', EMail: 'daniel.lunacek@aures.cz' },
        JobTitle: 'Group Sales Director',
        Superpower: 'Jak dosáhnout výsledku pomocí analýzy, lidí kolem sebe a správně nastavených procesů',
        Bio: 'Daniel Luňáček působí ve firmě 25 let. Svou kariéru začal jako representant v call centru a postupně se vypracoval přes pozici manažera poboček až na Regional Managera pro Českou republiku a Slovensko. Následně působil jako Country Manager pro CZ a SK a v současnosti zastává pozici Group Sales Director.\n\nNejvětší překonaná výzva: Naučit se delegovat, nevěřit jen v sám sebe, ale v tým.',
        Capacity: 2,
        AvailabilityNote: '',
        PhotoUrl: '',
        IsActive: true
    },
    {
        Id: 6,
        Title: 'Zdeněk Batěk',
        MentorUser: { Id: 106, Title: 'Zdeněk Batěk', EMail: 'zdenek.batek@aures.cz' },
        JobTitle: 'Group Purchasing Director',
        Superpower: 'Strategické myšlení a převedení vizí do reálné produkce',
        Bio: 'Zdeněk Batěk do AAA nastoupil v roce 2007 hned po střední škole na pozici testovacího technika. Po 3 letech se vrátil do Prahy a začal vykupovat auta jako mobilní výkupčí. V roce 2012 se posunul na pozici manažera mobilního výkupu. Byl vlastníkem nového projektu Buying Guide/Pricing Guide a nyní zastává pozici Group Purchasing Director.\n\nNejvětší překonaná výzva: Rychlý přechod do manažerské pozice v mladém věku s řízením pozičně i věkově starších kolegů.',
        Capacity: 2,
        AvailabilityNote: '',
        PhotoUrl: '',
        IsActive: true
    },
    {
        Id: 7,
        Title: 'Miroslav Vápeník',
        MentorUser: { Id: 107, Title: 'Miroslav Vápeník', EMail: 'miroslav.vapenik@aures.cz' },
        JobTitle: 'Managing Director PL',
        Superpower: 'Schopnost budovat výkonné obchodní týmy a rozvíjet jejich potenciál',
        Bio: 'Miroslav Vápeník působí ve společnosti dvacátým rokem. Ve firmě si prošel všechny prodejní pozice od Sales Closing Managera až po Country Managera CZ. Aktuálně působí jako Managing Director pro polský trh, kde se podílí na strategickém růstu a budování silné zákaznické zkušenosti.\n\nNejvětší překonaná výzva: Převzetí odpovědnosti za řízení a rozvoj trhu v Polsku — prostředí s jinou zákaznickou mentalitou a silnou konkurencí.',
        Capacity: 2,
        AvailabilityNote: '',
        PhotoUrl: '',
        IsActive: true
    },
    {
        Id: 8,
        Title: 'Alen Svoboda',
        MentorUser: { Id: 108, Title: 'Alen Svoboda', EMail: 'alen.svoboda@aures.cz' },
        JobTitle: 'General Manager Prague',
        Superpower: 'Na základě analýzy a empatické komunikace dokáže okolí vysvětlit, kam společně chceme dojít',
        Bio: 'Alen Svoboda působí ve firmě celkem 15 let a momentálně řídí pražský region. Svou kariéru začal jako prodejce na pobočce v Brně, kde velmi rychle postoupil na manažerské pozice. Nabral obrovské zkušenosti s chápáním prodeje jako vztahové záležitosti a souboru všech detailů ovlivňujících výkonnost business modelu.\n\nNejvětší překonaná výzva: Změnit pohled na strategii spolupracovníků a vysvětlovat hlubší motivanty ovlivňující pozitivní náhled v rámci fungování ve firmě.',
        Capacity: 2,
        AvailabilityNote: '',
        PhotoUrl: '',
        IsActive: true
    },
    {
        Id: 9,
        Title: 'Zuzana Voborníková',
        MentorUser: { Id: 109, Title: 'Zuzana Voborníková', EMail: 'zuzana.vobornikova@aures.cz' },
        JobTitle: 'Group Staffing Manager',
        Superpower: 'Schopnost pozitivně motivovat a propojovat lidi napříč týmy i zeměmi',
        Bio: 'Zuzana Voborníková působí na pozici Group Staffing Manager a vede náborové aktivity napříč skupinou ve všech zemích. Má více než dvacet let zkušeností v oblasti HR a recruitmentu v mezinárodních společnostech. V minulosti působila jako Senior Recruiter v Amazonu nebo ve vedoucích recruitment rolích ve firmách CSC či AB InBev.\n\nNejvětší překonaná výzva: Skloubení návratu na manažerskou roli s malým dítětem po MD. Otevření a personální obsazení poboček v Německu.',
        Capacity: 2,
        AvailabilityNote: '',
        PhotoUrl: '',
        IsActive: true
    },
    {
        Id: 10,
        Title: 'Marie Voršilková',
        MentorUser: { Id: 110, Title: 'Marie Voršilková', EMail: 'marie.vorsilkova@aures.cz' },
        JobTitle: 'Chief HR Officer',
        Superpower: 'Leadership, motivace lidí, práce se změnou',
        Bio: 'Marie Voršilková pochází z bankovního prostředí, kde prošla prodejními i rozvojovými rolemi v retailovém, korporátním i premium bankovnictví. Postupně ji její cesta přivedla od obchodu přes rozvoj lidí až ke komplexní HR agendě. Po přechodu do automotive prošla dynamickým obdobím změn — od integrace a slučování entit přes uzavírání zahraničních poboček až po optimalizace a restrukturalizace.\n\nNejvětší překonaná výzva: Udržet motivaci a energii pracovních týmů v obdobích velkých změn a ekonomických krizí.',
        Capacity: 2,
        AvailabilityNote: '',
        PhotoUrl: '',
        IsActive: true
    }
];
var MOCK_TALENTS = [
    {
        Id: 1,
        Title: 'Eva Malkova',
        TalentUser: { Id: 201, Title: 'Eva Malkova', EMail: 'eva.malkova@aures.cz' },
        IsActive: true
    },
    {
        Id: 2,
        Title: 'Ondrej Dostal',
        TalentUser: { Id: 202, Title: 'Ondrej Dostal', EMail: 'ondrej.dostal@aures.cz' },
        IsActive: true
    },
    {
        Id: 3,
        Title: 'Katerina Simkova',
        TalentUser: { Id: 203, Title: 'Katerina Simkova', EMail: 'katerina.simkova@aures.cz' },
        IsActive: true
    }
];
var MOCK_REQUESTS = [
    {
        Id: 1,
        Title: 'REQ-2026-1',
        TalentRef: { Id: 1, Title: 'Eva Malkova' },
        Mentor1Ref: { Id: 1, Title: 'Karolína Topolová' },
        Mentor2Ref: { Id: 2, Title: 'Petr Vaněček' },
        Mentor3Ref: { Id: 10, Title: 'Marie Voršilková' },
        Message1: 'Chtěla bych se naučit, jak prezentovat strategické projekty top managementu. Váš přístup k leadershipu je pro mě inspirující.',
        Message2: 'Zajímám se o digitalizaci a inovace v businessu.',
        Message3: 'Ráda bych pochopila HR perspektivu při řízení změn.',
        CurrentStage: 1,
        RequestStatus: _services_interfaces__WEBPACK_IMPORTED_MODULE_0__[/* RequestStatus */ "e"].Pending
    },
    {
        Id: 2,
        Title: 'REQ-2026-2',
        TalentRef: { Id: 2, Title: 'Ondrej Dostal' },
        Mentor1Ref: { Id: 4, Title: 'Martin Hrudník' },
        Mentor2Ref: { Id: 5, Title: 'Daniel Luňáček' },
        Message1: 'Chci se zdokonalit v operativním řízení a efektivitě procesů.',
        Message2: 'Obchodní dovednosti jsou klíč k mému kariérnímu rozvoji.',
        CurrentStage: 2,
        RequestStatus: _services_interfaces__WEBPACK_IMPORTED_MODULE_0__[/* RequestStatus */ "e"].Pending,
        Stage1Decision: _services_interfaces__WEBPACK_IMPORTED_MODULE_0__[/* StageDecision */ "t"].Rejected,
        Stage1DecisionDate: '2026-02-15T10:30:00Z',
        Stage1DecisionBy: { Id: 104, Title: 'Martin Hrudník', EMail: 'martin.hrudnik@aures.cz' }
    },
    {
        Id: 3,
        Title: 'REQ-2026-3',
        TalentRef: { Id: 3, Title: 'Katerina Simkova' },
        Mentor1Ref: { Id: 9, Title: 'Zuzana Voborníková' },
        Message1: 'Chtěla bych lépe porozumět náborovým procesům a budování týmů v mezinárodním prostředí.',
        CurrentStage: 1,
        RequestStatus: _services_interfaces__WEBPACK_IMPORTED_MODULE_0__[/* RequestStatus */ "e"].Approved,
        Stage1Decision: _services_interfaces__WEBPACK_IMPORTED_MODULE_0__[/* StageDecision */ "t"].Approved,
        Stage1DecisionDate: '2026-02-20T14:00:00Z',
        Stage1DecisionBy: { Id: 109, Title: 'Zuzana Voborníková', EMail: 'zuzana.vobornikova@aures.cz' }
    },
    {
        Id: 4,
        Title: 'REQ-2026-4',
        TalentRef: { Id: 1, Title: 'Eva Malkova' },
        Mentor1Ref: { Id: 7, Title: 'Miroslav Vápeník' },
        Mentor2Ref: { Id: 8, Title: 'Alen Svoboda' },
        Mentor3Ref: { Id: 3, Title: 'Luboš Vorlík' },
        Message1: 'Zajímám se o obchodní strategii na zahraničních trzích.',
        Message2: 'Prodej jako vztahová záležitost je téma, které mě zajímá.',
        Message3: 'Strategické řízení a rozvoj na trhu CZ/SK je to, co hledám.',
        CurrentStage: 3,
        RequestStatus: _services_interfaces__WEBPACK_IMPORTED_MODULE_0__[/* RequestStatus */ "e"].HR_Review,
        Stage1Decision: _services_interfaces__WEBPACK_IMPORTED_MODULE_0__[/* StageDecision */ "t"].Rejected,
        Stage1DecisionDate: '2026-01-10T09:00:00Z',
        Stage1DecisionBy: { Id: 107, Title: 'Miroslav Vápeník', EMail: 'miroslav.vapenik@aures.cz' },
        Stage2Decision: _services_interfaces__WEBPACK_IMPORTED_MODULE_0__[/* StageDecision */ "t"].Rejected,
        Stage2DecisionDate: '2026-01-15T11:00:00Z',
        Stage2DecisionBy: { Id: 108, Title: 'Alen Svoboda', EMail: 'alen.svoboda@aures.cz' },
        Stage3Decision: _services_interfaces__WEBPACK_IMPORTED_MODULE_0__[/* StageDecision */ "t"].Rejected,
        Stage3DecisionDate: '2026-01-20T13:00:00Z',
        Stage3DecisionBy: { Id: 103, Title: 'Luboš Vorlík', EMail: 'lubos.vorlik@aures.cz' }
    }
];


/***/ }),

/***/ "J7sA":
/*!*********************************************!*\
  !*** ./node_modules/@pnp/sp/lists/index.js ***!
  \*********************************************/
/*! exports provided: List, Lists, ControlMode, RenderListDataOptions */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _web_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./web.js */ "Bwa7");
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./types.js */ "hy0S");


//# sourceMappingURL=index.js.map

/***/ }),

/***/ "JC1J":
/*!*****************************************!*\
  !*** ./node_modules/@pnp/core/index.js ***!
  \*****************************************/
/*! exports provided: PnPClientStorageWrapper, PnPClientStorage, dateAdd, combine, getRandomString, getGUID, isFunc, isArray, isUrlAbsolute, stringIsNullOrEmpty, objectDefinedNotNull, jsS, hOP, parseToAtob, getHashCode, delay, broadcast, asyncBroadcast, reduce, asyncReduce, request, lifecycle, noInherit, once, Timeline, cloneObserverCollection, AssignFrom, CopyFrom */
/*! exports used: CopyFrom, PnPClientStorage, Timeline, asyncBroadcast, asyncReduce, broadcast, combine, dateAdd, delay, getGUID, getHashCode, hOP, isArray, isFunc, isUrlAbsolute, jsS, lifecycle, noInherit, objectDefinedNotNull, reduce, request, stringIsNullOrEmpty */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _storage_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./storage.js */ "L2F+");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "t", function() { return _storage_js__WEBPACK_IMPORTED_MODULE_0__["e"]; });

/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util.js */ "NuLX");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "o", function() { return _util_js__WEBPACK_IMPORTED_MODULE_1__["e"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "s", function() { return _util_js__WEBPACK_IMPORTED_MODULE_1__["t"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "c", function() { return _util_js__WEBPACK_IMPORTED_MODULE_1__["n"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "d", function() { return _util_js__WEBPACK_IMPORTED_MODULE_1__["a"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "l", function() { return _util_js__WEBPACK_IMPORTED_MODULE_1__["i"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "u", function() { return _util_js__WEBPACK_IMPORTED_MODULE_1__["r"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "f", function() { return _util_js__WEBPACK_IMPORTED_MODULE_1__["o"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "p", function() { return _util_js__WEBPACK_IMPORTED_MODULE_1__["s"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "m", function() { return _util_js__WEBPACK_IMPORTED_MODULE_1__["c"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "_", function() { return _util_js__WEBPACK_IMPORTED_MODULE_1__["d"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "g", function() { return _util_js__WEBPACK_IMPORTED_MODULE_1__["l"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "S", function() { return _util_js__WEBPACK_IMPORTED_MODULE_1__["u"]; });

/* harmony import */ var _moments_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./moments.js */ "DZog");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "a", function() { return _moments_js__WEBPACK_IMPORTED_MODULE_2__["e"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "i", function() { return _moments_js__WEBPACK_IMPORTED_MODULE_2__["t"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "r", function() { return _moments_js__WEBPACK_IMPORTED_MODULE_2__["n"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "h", function() { return _moments_js__WEBPACK_IMPORTED_MODULE_2__["a"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "v", function() { return _moments_js__WEBPACK_IMPORTED_MODULE_2__["i"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "y", function() { return _moments_js__WEBPACK_IMPORTED_MODULE_2__["r"]; });

/* harmony import */ var _timeline_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./timeline.js */ "4kGv");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "n", function() { return _timeline_js__WEBPACK_IMPORTED_MODULE_3__["e"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "b", function() { return _timeline_js__WEBPACK_IMPORTED_MODULE_3__["n"]; });

/* harmony import */ var _behaviors_assign_from_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./behaviors/assign-from.js */ "zhiF");
/* harmony import */ var _behaviors_copy_from_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./behaviors/copy-from.js */ "qNel");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "e", function() { return _behaviors_copy_from_js__WEBPACK_IMPORTED_MODULE_5__["e"]; });





/**
 * Behavior exports
 */


//# sourceMappingURL=index.js.map

/***/ }),

/***/ "Ku5p":
/*!***************************************************!*\
  !*** ./node_modules/@pnp/sp/sputilities/index.js ***!
  \***************************************************/
/*! exports provided: Utilities */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _fi_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../fi.js */ "v6VW");
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./types.js */ "AfLD");



Reflect.defineProperty(_fi_js__WEBPACK_IMPORTED_MODULE_0__[/* SPFI */ "e"].prototype, "utility", {
    configurable: true,
    enumerable: true,
    get: function () {
        return this.create(_types_js__WEBPACK_IMPORTED_MODULE_1__[/* Utilities */ "e"], "");
    },
});
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "L2F+":
/*!*******************************************!*\
  !*** ./node_modules/@pnp/core/storage.js ***!
  \*******************************************/
/*! exports provided: PnPClientStorageWrapper, PnPClientStorage */
/*! exports used: PnPClientStorage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export PnPClientStorageWrapper */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return PnPClientStorage; });
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util.js */ "NuLX");

let storageShim;
function getStorageShim() {
    if (typeof storageShim === "undefined") {
        storageShim = new MemoryStorage();
    }
    return storageShim;
}
/**
 * A wrapper class to provide a consistent interface to browser based storage
 *
 */
class PnPClientStorageWrapper {
    /**
     * Creates a new instance of the PnPClientStorageWrapper class
     *
     * @constructor
     */
    constructor(store) {
        this.store = store;
        this.enabled = this.test();
    }
    /**
     * Get a value from storage, or null if that value does not exist
     *
     * @param key The key whose value we want to retrieve
     */
    get(key) {
        if (!this.enabled) {
            return null;
        }
        const o = this.store.getItem(key);
        if (!Object(_util_js__WEBPACK_IMPORTED_MODULE_0__[/* objectDefinedNotNull */ "l"])(o)) {
            return null;
        }
        const persistable = JSON.parse(o);
        if (new Date(persistable.expiration) <= new Date()) {
            this.delete(key);
            return null;
        }
        else {
            return persistable.value;
        }
    }
    /**
     * Adds a value to the underlying storage
     *
     * @param key The key to use when storing the provided value
     * @param o The value to store
     * @param expire Optional, if provided the expiration of the item, otherwise the default is used
     */
    put(key, o, expire) {
        if (this.enabled) {
            this.store.setItem(key, this.createPersistable(o, expire));
        }
    }
    /**
     * Deletes a value from the underlying storage
     *
     * @param key The key of the pair we want to remove from storage
     */
    delete(key) {
        if (this.enabled) {
            this.store.removeItem(key);
        }
    }
    /**
     * Gets an item from the underlying storage, or adds it if it does not exist using the supplied getter function
     *
     * @param key The key to use when storing the provided value
     * @param getter A function which will upon execution provide the desired value
     * @param expire Optional, if provided the expiration of the item, otherwise the default is used
     */
    async getOrPut(key, getter, expire) {
        if (!this.enabled) {
            return getter();
        }
        let o = this.get(key);
        if (o === null) {
            o = await getter();
            this.put(key, o, expire);
        }
        return o;
    }
    /**
     * Deletes any expired items placed in the store by the pnp library, leaves other items untouched
     */
    async deleteExpired() {
        if (!this.enabled) {
            return;
        }
        for (let i = 0; i < this.store.length; i++) {
            const key = this.store.key(i);
            if (key !== null) {
                // test the stored item to see if we stored it
                if (/["|']?pnp["|']? ?: ?1/i.test(this.store.getItem(key))) {
                    // get those items as get will delete from cache if they are expired
                    await this.get(key);
                }
            }
        }
    }
    /**
     * Used to determine if the wrapped storage is available currently
     */
    test() {
        const str = "t";
        try {
            this.store.setItem(str, str);
            this.store.removeItem(str);
            return true;
        }
        catch (e) {
            return false;
        }
    }
    /**
     * Creates the persistable to store
     */
    createPersistable(o, expire) {
        if (expire === undefined) {
            expire = Object(_util_js__WEBPACK_IMPORTED_MODULE_0__[/* dateAdd */ "t"])(new Date(), "minute", 5);
        }
        return Object(_util_js__WEBPACK_IMPORTED_MODULE_0__[/* jsS */ "d"])({ pnp: 1, expiration: expire, value: o });
    }
}
/**
 * A thin implementation of in-memory storage for use in nodejs
 */
class MemoryStorage {
    constructor(_store = new Map()) {
        this._store = _store;
    }
    get length() {
        return this._store.size;
    }
    clear() {
        this._store.clear();
    }
    getItem(key) {
        return this._store.get(key);
    }
    key(index) {
        return Array.from(this._store)[index][0];
    }
    removeItem(key) {
        this._store.delete(key);
    }
    setItem(key, data) {
        this._store.set(key, data);
    }
}
/**
 * A class that will establish wrappers for both local and session storage, substituting basic memory storage for nodejs
 */
class PnPClientStorage {
    /**
     * Creates a new instance of the PnPClientStorage class
     *
     * @constructor
     */
    constructor(_local = null, _session = null) {
        this._local = _local;
        this._session = _session;
    }
    /**
     * Provides access to the local storage of the browser
     */
    get local() {
        if (this._local === null) {
            this._local = new PnPClientStorageWrapper(typeof localStorage === "undefined" ? getStorageShim() : localStorage);
        }
        return this._local;
    }
    /**
     * Provides access to the session storage of the browser
     */
    get session() {
        if (this._session === null) {
            this._session = new PnPClientStorageWrapper(typeof sessionStorage === "undefined" ? getStorageShim() : sessionStorage);
        }
        return this._session;
    }
}
//# sourceMappingURL=storage.js.map

/***/ }),

/***/ "LVfT":
/*!**************************************************************!*\
  !*** ./node_modules/@pnp/sp/node_modules/tslib/tslib.es6.js ***!
  \**************************************************************/
/*! exports provided: __extends, __assign, __rest, __decorate, __param, __esDecorate, __runInitializers, __propKey, __setFunctionName, __metadata, __awaiter, __generator, __createBinding, __exportStar, __values, __read, __spread, __spreadArrays, __spreadArray, __await, __asyncGenerator, __asyncDelegator, __asyncValues, __makeTemplateObject, __importStar, __importDefault, __classPrivateFieldGet, __classPrivateFieldSet, __classPrivateFieldIn, __addDisposableResource, __disposeResources, __rewriteRelativeImportExtension, default */
/*! exports used: __decorate */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export __extends */
/* unused harmony export __assign */
/* unused harmony export __rest */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return __decorate; });
/* unused harmony export __param */
/* unused harmony export __esDecorate */
/* unused harmony export __runInitializers */
/* unused harmony export __propKey */
/* unused harmony export __setFunctionName */
/* unused harmony export __metadata */
/* unused harmony export __awaiter */
/* unused harmony export __generator */
/* unused harmony export __createBinding */
/* unused harmony export __exportStar */
/* unused harmony export __values */
/* unused harmony export __read */
/* unused harmony export __spread */
/* unused harmony export __spreadArrays */
/* unused harmony export __spreadArray */
/* unused harmony export __await */
/* unused harmony export __asyncGenerator */
/* unused harmony export __asyncDelegator */
/* unused harmony export __asyncValues */
/* unused harmony export __makeTemplateObject */
/* unused harmony export __importStar */
/* unused harmony export __importDefault */
/* unused harmony export __classPrivateFieldGet */
/* unused harmony export __classPrivateFieldSet */
/* unused harmony export __classPrivateFieldIn */
/* unused harmony export __addDisposableResource */
/* unused harmony export __disposeResources */
/* unused harmony export __rewriteRelativeImportExtension */
/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __esDecorate(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};

function __runInitializers(thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};

function __propKey(x) {
    return typeof x === "symbol" ? x : "".concat(x);
};

function __setFunctionName(f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var __createBinding = Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});

function __exportStar(m, o) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

/** @deprecated */
function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

/** @deprecated */
function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
    function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
    function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

var __setModuleDefault = Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
};

var ownKeys = function(o) {
    ownKeys = Object.getOwnPropertyNames || function (o) {
        var ar = [];
        for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
        return ar;
    };
    return ownKeys(o);
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
    __setModuleDefault(result, mod);
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

function __classPrivateFieldIn(state, receiver) {
    if (receiver === null || (typeof receiver !== "object" && typeof receiver !== "function")) throw new TypeError("Cannot use 'in' operator on non-object");
    return typeof state === "function" ? receiver === state : state.has(receiver);
}

function __addDisposableResource(env, value, async) {
    if (value !== null && value !== void 0) {
        if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
        var dispose, inner;
        if (async) {
            if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
            dispose = value[Symbol.asyncDispose];
        }
        if (dispose === void 0) {
            if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
            dispose = value[Symbol.dispose];
            if (async) inner = dispose;
        }
        if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
        if (inner) dispose = function() { try { inner.call(this); } catch (e) { return Promise.reject(e); } };
        env.stack.push({ value: value, dispose: dispose, async: async });
    }
    else if (async) {
        env.stack.push({ async: true });
    }
    return value;

}

var _SuppressedError = typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

function __disposeResources(env) {
    function fail(e) {
        env.error = env.hasError ? new _SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
        env.hasError = true;
    }
    var r, s = 0;
    function next() {
        while (r = env.stack.pop()) {
            try {
                if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
                if (r.dispose) {
                    var result = r.dispose.call(r.value);
                    if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
                }
                else s |= 1;
            }
            catch (e) {
                fail(e);
            }
        }
        if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
        if (env.hasError) throw env.error;
    }
    return next();
}

function __rewriteRelativeImportExtension(path, preserveJsx) {
    if (typeof path === "string" && /^\.\.?\//.test(path)) {
        return path.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function (m, tsx, d, ext, cm) {
            return tsx ? preserveJsx ? ".jsx" : ".js" : d && (!ext || !cm) ? m : (d + ext + "." + cm.toLowerCase() + "js");
        });
    }
    return path;
}

/* unused harmony default export */ var _unused_webpack_default_export = ({
    __extends: __extends,
    __assign: __assign,
    __rest: __rest,
    __decorate: __decorate,
    __param: __param,
    __esDecorate: __esDecorate,
    __runInitializers: __runInitializers,
    __propKey: __propKey,
    __setFunctionName: __setFunctionName,
    __metadata: __metadata,
    __awaiter: __awaiter,
    __generator: __generator,
    __createBinding: __createBinding,
    __exportStar: __exportStar,
    __values: __values,
    __read: __read,
    __spread: __spread,
    __spreadArrays: __spreadArrays,
    __spreadArray: __spreadArray,
    __await: __await,
    __asyncGenerator: __asyncGenerator,
    __asyncDelegator: __asyncDelegator,
    __asyncValues: __asyncValues,
    __makeTemplateObject: __makeTemplateObject,
    __importStar: __importStar,
    __importDefault: __importDefault,
    __classPrivateFieldGet: __classPrivateFieldGet,
    __classPrivateFieldSet: __classPrivateFieldSet,
    __classPrivateFieldIn: __classPrivateFieldIn,
    __addDisposableResource: __addDisposableResource,
    __disposeResources: __disposeResources,
    __rewriteRelativeImportExtension: __rewriteRelativeImportExtension,
});


/***/ }),

/***/ "NTTg":
/*!********************************************!*\
  !*** ./node_modules/@pnp/sp/items/list.js ***!
  \********************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _pnp_queryable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @pnp/queryable */ "Ymo3");
/* harmony import */ var _lists_types_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lists/types.js */ "hy0S");
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./types.js */ "3DT9");



Object(_pnp_queryable__WEBPACK_IMPORTED_MODULE_0__[/* addProp */ "c"])(_lists_types_js__WEBPACK_IMPORTED_MODULE_1__[/* _List */ "n"], "items", _types_js__WEBPACK_IMPORTED_MODULE_2__[/* Items */ "e"]);
//# sourceMappingURL=list.js.map

/***/ }),

/***/ "NfnK":
/*!****************************************************************!*\
  !*** ./node_modules/@pnp/queryable/behaviors/debug-headers.js ***!
  \****************************************************************/
/*! exports provided: DebugHeaders */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export DebugHeaders */
/**
 *
 * @param otherHeaders Optional list of additional headers to log from the response
 * @returns A timeline pipe
 */
function DebugHeaders(otherHeaders = []) {
    return (instance) => {
        instance.on.parse.prepend(async function (url, response, result) {
            var _a;
            // here we add logging for the request id and timestamp to assist in reporting issues to Microsoft
            const searchHeaders = ["request-id", "sprequestguid", "date", ...otherHeaders];
            for (let i = 0; i < searchHeaders.length; i++) {
                this.log(`${searchHeaders[i]}: ${(_a = response.headers.get(searchHeaders[i])) !== null && _a !== void 0 ? _a : ""}`);
            }
            return [url, response, result];
        });
        return instance;
    };
}
//# sourceMappingURL=debug-headers.js.map

/***/ }),

/***/ "NuLX":
/*!****************************************!*\
  !*** ./node_modules/@pnp/core/util.js ***!
  \****************************************/
/*! exports provided: dateAdd, combine, getRandomString, getGUID, isFunc, isArray, isUrlAbsolute, stringIsNullOrEmpty, objectDefinedNotNull, jsS, hOP, parseToAtob, getHashCode, delay */
/*! exports used: combine, dateAdd, delay, getGUID, getHashCode, hOP, isArray, isFunc, isUrlAbsolute, jsS, objectDefinedNotNull, stringIsNullOrEmpty */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "t", function() { return dateAdd; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return combine; });
/* unused harmony export getRandomString */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return getGUID; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "s", function() { return isFunc; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "o", function() { return isArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return isUrlAbsolute; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "u", function() { return stringIsNullOrEmpty; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return objectDefinedNotNull; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return jsS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "r", function() { return hOP; });
/* unused harmony export parseToAtob */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return getHashCode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return delay; });
/**
 * Adds a value to a date
 *
 * @param date The date to which we will add units, done in local time
 * @param interval The name of the interval to add, one of: ['year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second']
 * @param units The amount to add to date of the given interval
 *
 * http://stackoverflow.com/questions/1197928/how-to-add-30-minutes-to-a-javascript-date-object
 */
function dateAdd(date, interval, units) {
    let ret = new Date(date.toString()); // don't change original date
    switch (interval.toLowerCase()) {
        case "year":
            ret.setFullYear(ret.getFullYear() + units);
            break;
        case "quarter":
            ret.setMonth(ret.getMonth() + 3 * units);
            break;
        case "month":
            ret.setMonth(ret.getMonth() + units);
            break;
        case "week":
            ret.setDate(ret.getDate() + 7 * units);
            break;
        case "day":
            ret.setDate(ret.getDate() + units);
            break;
        case "hour":
            ret.setTime(ret.getTime() + units * 3600000);
            break;
        case "minute":
            ret.setTime(ret.getTime() + units * 60000);
            break;
        case "second":
            ret.setTime(ret.getTime() + units * 1000);
            break;
        default:
            ret = undefined;
            break;
    }
    return ret;
}
/**
 * Combines an arbitrary set of paths ensuring and normalizes the slashes
 *
 * @param paths 0 to n path parts to combine
 */
function combine(...paths) {
    return paths
        .filter(path => !stringIsNullOrEmpty(path))
        .map(path => path.replace(/^[\\|/]/, "").replace(/[\\|/]$/, ""))
        .join("/")
        .replace(/\\/g, "/");
}
/**
 * Gets a random string of chars length
 *
 * https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
 *
 * @param chars The length of the random string to generate
 */
function getRandomString(chars) {
    const text = new Array(chars);
    for (let i = 0; i < chars; i++) {
        text[i] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(Math.floor(Math.random() * 62));
    }
    return text.join("");
}
/**
 * Gets a random GUID value
 *
 * http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
 */
/* eslint-disable no-bitwise */
function getGUID() {
    let d = Date.now();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        const r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
    });
}
/* eslint-enable no-bitwise */
/**
 * Determines if a given value is a function
 *
 * @param f The thing to test for functionness
 */
// eslint-disable-next-line @typescript-eslint/ban-types
function isFunc(f) {
    return typeof f === "function";
}
/**
 * @returns whether the provided parameter is a JavaScript Array or not.
*/
function isArray(array) {
    return Array.isArray(array);
}
/**
 * Determines if a given url is absolute
 *
 * @param url The url to check to see if it is absolute
 */
function isUrlAbsolute(url) {
    return /^https?:\/\/|^\/\//i.test(url);
}
/**
 * Determines if a string is null or empty or undefined
 *
 * @param s The string to test
 */
function stringIsNullOrEmpty(s) {
    return typeof s === "undefined" || s === null || s.length < 1;
}
/**
 * Determines if an object is both defined and not null
 * @param obj Object to test
 */
function objectDefinedNotNull(obj) {
    return typeof obj !== "undefined" && obj !== null;
}
/**
 * Shorthand for JSON.stringify
 *
 * @param o Any type of object
 */
function jsS(o) {
    return JSON.stringify(o);
}
/**
 * Shorthand for Object.hasOwnProperty
 *
 * @param o Object to check for
 * @param p Name of the property
 */
function hOP(o, p) {
    return Object.hasOwnProperty.call(o, p);
}
/**
 * @returns validates and returns a valid atob conversion
*/
function parseToAtob(str) {
    const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;
    try {
        // test if str has been JSON.stringified
        const parsed = JSON.parse(str);
        if (base64Regex.test(parsed)) {
            return atob(parsed);
        }
        return null;
    }
    catch (err) {
        // Not a valid JSON string, check if it's a standalone Base64 string
        return base64Regex.test(str) ? atob(str) : null;
    }
}
/**
 * Generates a ~unique hash code
 *
 * From: https://stackoverflow.com/questions/6122571/simple-non-secure-hash-function-for-javascript
 */
/* eslint-disable no-bitwise */
function getHashCode(s) {
    let hash = 0;
    if (s.length === 0) {
        return hash;
    }
    for (let i = 0; i < s.length; i++) {
        const chr = s.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}
/* eslint-enable no-bitwise */
/**
 * Waits a specified number of milliseconds before resolving
 *
 * @param ms Number of ms to wait
 */
function delay(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
//# sourceMappingURL=util.js.map

/***/ }),

/***/ "OWTB":
/*!************************************************!*\
  !*** ./node_modules/@pnp/sp/behaviors/spfx.js ***!
  \************************************************/
/*! exports provided: SPFxToken, SPFx */
/*! exports used: SPFx */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export SPFxToken */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return SPFx; });
/* harmony import */ var _pnp_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @pnp/core */ "JC1J");
/* harmony import */ var _pnp_queryable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @pnp/queryable */ "Ymo3");
/* harmony import */ var _defaults_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./defaults.js */ "qZw7");
/* harmony import */ var _request_digest_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./request-digest.js */ "GfGO");




class SPFxTokenNullOrUndefinedError extends Error {
    constructor(behaviorName) {
        super(`SPFx Context supplied to ${behaviorName} Behavior is null or undefined.`);
    }
    static check(behaviorName, context) {
        if (typeof context === "undefined" || context === null) {
            throw new SPFxTokenNullOrUndefinedError(behaviorName);
        }
    }
}
function SPFxToken(context) {
    SPFxTokenNullOrUndefinedError.check("SPFxToken", context);
    return (instance) => {
        instance.on.auth.replace(async function (url, init) {
            const provider = await context.aadTokenProviderFactory.getTokenProvider();
            const token = await provider.getToken(`${url.protocol}//${url.hostname}`);
            // eslint-disable-next-line @typescript-eslint/dot-notation
            init.headers["Authorization"] = `Bearer ${token}`;
            return [url, init];
        });
        return instance;
    };
}
function SPFx(context) {
    SPFxTokenNullOrUndefinedError.check("SPFx", context);
    return (instance) => {
        instance.using(Object(_defaults_js__WEBPACK_IMPORTED_MODULE_2__[/* DefaultHeaders */ "e"])(), Object(_defaults_js__WEBPACK_IMPORTED_MODULE_2__[/* DefaultInit */ "t"])(), Object(_pnp_queryable__WEBPACK_IMPORTED_MODULE_1__[/* BrowserFetchWithRetry */ "e"])(), Object(_pnp_queryable__WEBPACK_IMPORTED_MODULE_1__[/* DefaultParse */ "t"])(), 
        // remove SPFx Token in default due to issues #2570, #2571
        // SPFxToken(context),
        Object(_request_digest_js__WEBPACK_IMPORTED_MODULE_3__[/* RequestDigest */ "e"])((url) => {
            var _a, _b, _c;
            const sameWeb = (new RegExp(`^${Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* combine */ "o"])(context.pageContext.web.absoluteUrl, "/_api")}`, "i")).test(url);
            if (sameWeb && ((_b = (_a = context === null || context === void 0 ? void 0 : context.pageContext) === null || _a === void 0 ? void 0 : _a.legacyPageContext) === null || _b === void 0 ? void 0 : _b.formDigestValue)) {
                const creationDateFromDigest = new Date(context.pageContext.legacyPageContext.formDigestValue.split(",")[1]);
                // account for page lifetime in timeout #2304 & others
                // account for tab sleep #2550
                return {
                    value: context.pageContext.legacyPageContext.formDigestValue,
                    expiration: Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* dateAdd */ "s"])(creationDateFromDigest, "second", ((_c = context.pageContext.legacyPageContext) === null || _c === void 0 ? void 0 : _c.formDigestTimeoutSeconds) - 15 || 1585),
                };
            }
        }));
        // we want to fix up the url first
        instance.on.pre.prepend(async (url, init, result) => {
            if (!Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* isUrlAbsolute */ "m"])(url)) {
                url = Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* combine */ "o"])(context.pageContext.web.absoluteUrl, url);
            }
            return [url, init, result];
        });
        return instance;
    };
}
//# sourceMappingURL=spfx.js.map

/***/ }),

/***/ "OXUt":
/*!*******************************************************!*\
  !*** ./node_modules/@pnp/sp/utils/extract-web-url.js ***!
  \*******************************************************/
/*! exports provided: extractWebUrl */
/*! exports used: extractWebUrl */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return extractWebUrl; });
/* harmony import */ var _pnp_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @pnp/core */ "JC1J");

function extractWebUrl(candidateUrl) {
    if (Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* stringIsNullOrEmpty */ "S"])(candidateUrl)) {
        return "";
    }
    let index = candidateUrl.indexOf("_api/");
    if (index < 0) {
        index = candidateUrl.indexOf("_vti_bin/");
    }
    if (index > -1) {
        return candidateUrl.substring(0, index);
    }
    // if all else fails just give them what they gave us back
    return candidateUrl;
}
//# sourceMappingURL=extract-web-url.js.map

/***/ }),

/***/ "PFk9":
/*!*********************************************!*\
  !*** ./lib/services/NotificationService.js ***!
  \*********************************************/
/*! exports provided: NotificationService */
/*! exports used: NotificationService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return NotificationService; });
/* harmony import */ var _pnp_sp_sputilities__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @pnp/sp/sputilities */ "Ku5p");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};

/**
 * Odeslani emailu pres SP Utility.sendEmail (client-side, bez Power Automate).
 * Vyzaduje ze odesilajici uzivatel ma pravo odesilat maily pres SP.
 */
var NotificationService = /** @class */ (function () {
    function NotificationService(_sp) {
        this._sp = _sp;
    }
    // ----------------------------------------------------------------
    // Verejne metody
    // ----------------------------------------------------------------
    /** Submit: notifikuje Mentora 1 o nove zadosti */
    NotificationService.prototype.notifyMentorOnSubmit = function (mentor, talent, requestId, requestTitle) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var email;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        email = {
                            To: [(_b = (_a = mentor.MentorUser) === null || _a === void 0 ? void 0 : _a.EMail) !== null && _b !== void 0 ? _b : ''],
                            Subject: "Aures Elite Mentoring \u2013 Nova zadost o mentoring [".concat(requestTitle, "]"),
                            Body: this._buildMentorRequestBody(mentor, talent, requestId, requestTitle)
                        };
                        return [4 /*yield*/, this._send(email)];
                    case 1:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /** Reject + dalsi mentor: notifikuje nasledujiciho mentora */
    NotificationService.prototype.notifyNextMentorOnReject = function (nextMentor, talent, requestId, requestTitle) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var email;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        email = {
                            To: [(_b = (_a = nextMentor.MentorUser) === null || _a === void 0 ? void 0 : _a.EMail) !== null && _b !== void 0 ? _b : ''],
                            Subject: "Aures Elite Mentoring \u2013 Zadost o mentoring ceka na Vase vyjadreni [".concat(requestTitle, "]"),
                            Body: this._buildMentorRequestBody(nextMentor, talent, requestId, requestTitle)
                        };
                        return [4 /*yield*/, this._send(email)];
                    case 1:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /** Reject + zadny dalsi mentor: notifikuje HR o eskalaci */
    NotificationService.prototype.notifyHROnEscalation = function (hrEmail, talent, requestId, requestTitle) {
        return __awaiter(this, void 0, void 0, function () {
            var email;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        email = {
                            To: [hrEmail],
                            Subject: "Aures Elite Mentoring \u2013 HR Review vyzadovan [".concat(requestTitle, "]"),
                            Body: this._buildHREscalationBody(talent, requestId, requestTitle)
                        };
                        return [4 /*yield*/, this._send(email)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /** Approve: notifikuje HR i Talenta ke sjednanemu mentoringu */
    NotificationService.prototype.notifyOnApproval = function (hrEmail, talent, mentor, requestId, requestTitle) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var talentEmail, email;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        talentEmail = (_b = (_a = talent.TalentUser) === null || _a === void 0 ? void 0 : _a.EMail) !== null && _b !== void 0 ? _b : '';
                        email = {
                            To: [hrEmail],
                            CC: talentEmail ? [talentEmail] : [],
                            Subject: "Aures Elite Mentoring \u2013 Zadost schvalena [".concat(requestTitle, "]"),
                            Body: this._buildApprovalBody(talent, mentor, requestId, requestTitle)
                        };
                        return [4 /*yield*/, this._send(email)];
                    case 1:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // ----------------------------------------------------------------
    // Soukrome helpery
    // ----------------------------------------------------------------
    NotificationService.prototype._send = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this._sp.utility.sendEmail(email)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        // Logujeme chybu, ale nenechame ji shodil UI — notifikace jsou best-effort
                        console.error('[NotificationService] sendEmail selhal:', err_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    NotificationService.prototype._buildMentorRequestBody = function (mentor, talent, requestId, requestTitle) {
        return "\n<p>Vazeny/a ".concat(mentor.Title, ",</p>\n<p>\n  Talent <strong>").concat(talent.Title, "</strong> Vas pozadal/a o mentoring.\n  Cilem je profesni rust v ramci Aures Holdings.\n</p>\n<p>\n  <strong>ID zadosti:</strong> ").concat(requestTitle, "<br/>\n  <strong>ID zaznamu:</strong> ").concat(requestId, "\n</p>\n<p>\n  Prosim, otevrete aplikaci Aures Elite Mentoring v SharePointu a zadost schvalte nebo zamitnte.\n</p>\n<p>S pozdravem,<br/>Aures Elite Mentoring System</p>\n    ").trim();
    };
    NotificationService.prototype._buildHREscalationBody = function (talent, requestId, requestTitle) {
        return "\n<p>Dobry den,</p>\n<p>\n  Zadost talenta <strong>".concat(talent.Title, "</strong> (").concat(requestTitle, ") byla zam\u00EDtnuta\n  vsemi vybranymi mentory a presla do stavu <strong>HR Review</strong>.\n</p>\n<p>\n  <strong>ID zadosti:</strong> ").concat(requestTitle, "<br/>\n  <strong>ID zaznamu:</strong> ").concat(requestId, "\n</p>\n<p>\n  Prosim, otevrete HR Admin Panel v aplikaci Aures Elite Mentoring\n  a dohodnte nasledny postup s talentem.\n</p>\n<p>S pozdravem,<br/>Aures Elite Mentoring System</p>\n    ").trim();
    };
    NotificationService.prototype._buildApprovalBody = function (talent, mentor, requestId, requestTitle) {
        return "\n<p>Dobry den,</p>\n<p>\n  Zadost talenta <strong>".concat(talent.Title, "</strong> byla <strong>schvalena</strong>\n  mentorem <strong>").concat(mentor.Title, "</strong> (").concat(mentor.JobTitle, ").\n</p>\n<p>\n  <strong>ID zadosti:</strong> ").concat(requestTitle, "<br/>\n  <strong>ID zaznamu:</strong> ").concat(requestId, "\n</p>\n<p>\n  Prosim koordinujte nasledne kroky \u2014 naplanovani uvodni schuze mezi talentem a mentorem.\n</p>\n<p>S pozdravem,<br/>Aures Elite Mentoring System</p>\n    ").trim();
    };
    return NotificationService;
}());



/***/ }),

/***/ "Rf+8":
/*!***************************************************************!*\
  !*** ./lib/webparts/auresApp/components/talent/MyRequests.js ***!
  \***************************************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "cDcd");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../AuresApp.module.scss */ "sg2l");
/* harmony import */ var _services_interfaces__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../services/interfaces */ "FFPM");
/* harmony import */ var _services_MentoringService__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../services/MentoringService */ "39m/");
/* harmony import */ var _utils_mockData__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../utils/mockData */ "IxoJ");





var MyRequests = function (_a) {
    var sp = _a.sp, currentUser = _a.currentUser;
    var _b = react__WEBPACK_IMPORTED_MODULE_0__["useState"]([]), requests = _b[0], setRequests = _b[1];
    var _c = react__WEBPACK_IMPORTED_MODULE_0__["useState"](true), loading = _c[0], setLoading = _c[1];
    react__WEBPACK_IMPORTED_MODULE_0__["useEffect"](function () {
        var _a;
        var talentId = (_a = currentUser.talentRecord) === null || _a === void 0 ? void 0 : _a.Id;
        if (!talentId) {
            setRequests(_utils_mockData__WEBPACK_IMPORTED_MODULE_4__[/* MOCK_REQUESTS */ "t"].filter(function (r) { return r.TalentRef.Id === 1; }));
            setLoading(false);
            return;
        }
        new _services_MentoringService__WEBPACK_IMPORTED_MODULE_3__[/* MentoringService */ "e"](sp).getMyRequests(talentId)
            .then(setRequests)
            .catch(function () { return setRequests(_utils_mockData__WEBPACK_IMPORTED_MODULE_4__[/* MOCK_REQUESTS */ "t"].filter(function (r) { return r.TalentRef.Id === talentId; })); })
            .finally(function () { return setLoading(false); });
    }, [sp, currentUser]);
    if (loading)
        return react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].loading }, "Na\u010D\u00EDt\u00E1m \u017E\u00E1dosti\u2026");
    if (requests.length === 0) {
        return (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].emptyState },
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("p", null, "Zat\u00EDm nem\u00E1\u0161 \u017E\u00E1dn\u00E9 \u017E\u00E1dosti o mentoring.")));
    }
    return (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", null,
        react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("h2", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].pageTitle }, "Moje \u017E\u00E1dosti"),
        react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].requestList }, requests.map(function (req) { return react__WEBPACK_IMPORTED_MODULE_0__["createElement"](RequestCard, { key: req.Id, request: req }); }))));
};
var RequestCard = function (_a) {
    var request = _a.request;
    var stages = [
        { mentor: request.Mentor1Ref, stage: 1 },
        { mentor: request.Mentor2Ref, stage: 2 },
        { mentor: request.Mentor3Ref, stage: 3 }
    ].filter(function (s) { return s.mentor != null; });
    var getDecision = function (stage) {
        if (stage === 1)
            return request.Stage1Decision;
        if (stage === 2)
            return request.Stage2Decision;
        return request.Stage3Decision;
    };
    var getMentorStatus = function (stage) {
        var decision = getDecision(stage);
        if (request.RequestStatus === _services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* RequestStatus */ "e"].Approved && decision === _services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* StageDecision */ "t"].Approved) {
            return { label: 'Schváleno', className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].statusApproved };
        }
        if (decision === _services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* StageDecision */ "t"].Rejected) {
            return { label: 'Zamítnuto', className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].statusCancelled };
        }
        if (request.CurrentStage === stage && request.RequestStatus === _services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* RequestStatus */ "e"].Pending) {
            return { label: 'Čeká na schválení', className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].statusPending };
        }
        if (stage > request.CurrentStage && request.RequestStatus === _services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* RequestStatus */ "e"].Pending) {
            return { label: 'Ve frontě', className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].statusQueued };
        }
        if (request.RequestStatus === _services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* RequestStatus */ "e"].HR_Review) {
            return { label: 'Předáno na HR', className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].statusHR };
        }
        if (request.RequestStatus === _services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* RequestStatus */ "e"].Scheduled) {
            return { label: 'Naplánováno', className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].statusScheduled };
        }
        if (request.RequestStatus === _services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* RequestStatus */ "e"].Cancelled) {
            return { label: 'Zrušeno', className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].statusCancelled };
        }
        return { label: 'Čeká', className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].statusPending };
    };
    return (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].requestCard }, stages.map(function (_a) {
        var mentor = _a.mentor, stage = _a.stage;
        var status = getMentorStatus(stage);
        return (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { key: stage, className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].myRequestMentorRow },
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("span", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].myRequestMentorName },
                "Mentoring od ",
                mentor.Title),
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("span", { className: [_AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].statusBadge, status.className].join(' ') }, status.label)));
    })));
};
/* harmony default export */ __webpack_exports__["e"] = (MyRequests);


/***/ }),

/***/ "S1sg":
/*!******************************************************!*\
  !*** ./lib/webparts/auresApp/components/AuresApp.js ***!
  \******************************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "cDcd");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AuresApp.module.scss */ "sg2l");
/* harmony import */ var _services_interfaces__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../services/interfaces */ "FFPM");
/* harmony import */ var _services_RoleService__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../services/RoleService */ "im7C");
/* harmony import */ var _services_MentoringService__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../services/MentoringService */ "39m/");
/* harmony import */ var _AppShell__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./AppShell */ "jdhR");
/* harmony import */ var _AccessDenied__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./AccessDenied */ "SU6V");
/* harmony import */ var _talent_MentorCatalog__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./talent/MentorCatalog */ "XeuW");
/* harmony import */ var _talent_RequestForm__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./talent/RequestForm */ "mGT/");
/* harmony import */ var _talent_MyRequests__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./talent/MyRequests */ "Rf+8");
/* harmony import */ var _talent_ResetChoice__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./talent/ResetChoice */ "VJuY");
/* harmony import */ var _mentor_PendingRequests__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./mentor/PendingRequests */ "SWTO");
/* harmony import */ var _mentor_RequestDetail__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./mentor/RequestDetail */ "rLnf");
/* harmony import */ var _mentor_RequestHistory__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./mentor/RequestHistory */ "WEcB");
/* harmony import */ var _hr_AllRequests__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./hr/AllRequests */ "U+bE");
/* harmony import */ var _hr_ApprovedMentorings__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./hr/ApprovedMentorings */ "sFlq");
/* harmony import */ var _hr_HRReviewQueue__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./hr/HRReviewQueue */ "DUND");
/* harmony import */ var _hr_MentorManagement__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./hr/MentorManagement */ "a6z2");
/* harmony import */ var _hr_TalentManagement__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./hr/TalentManagement */ "l2Og");
/* harmony import */ var _hr_CapacityDashboard__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./hr/CapacityDashboard */ "zlKG");




















var AuresApp = function (_a) {
    var sp = _a.sp, hrEmail = _a.hrEmail;
    var _b = react__WEBPACK_IMPORTED_MODULE_0__["useState"](null), currentUser = _b[0], setCurrentUser = _b[1];
    var _c = react__WEBPACK_IMPORTED_MODULE_0__["useState"](true), loading = _c[0], setLoading = _c[1];
    var _d = react__WEBPACK_IMPORTED_MODULE_0__["useState"](null), error = _d[0], setError = _d[1];
    var _e = react__WEBPACK_IMPORTED_MODULE_0__["useState"](null), view = _e[0], setView = _e[1];
    var _f = react__WEBPACK_IMPORTED_MODULE_0__["useState"]({}), navParams = _f[0], setNavParams = _f[1];
    var _g = react__WEBPACK_IMPORTED_MODULE_0__["useState"]({}), navBadges = _g[0], setNavBadges = _g[1];
    var _h = react__WEBPACK_IMPORTED_MODULE_0__["useState"](false), hasActiveRequests = _h[0], setHasActiveRequests = _h[1];
    var checkActiveRequests = react__WEBPACK_IMPORTED_MODULE_0__["useCallback"](function (user) {
        if (!user.roles.includes(_services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* UserRole */ "n"].Talent) || !user.talentRecord) {
            setHasActiveRequests(false);
            return;
        }
        new _services_MentoringService__WEBPACK_IMPORTED_MODULE_4__[/* MentoringService */ "e"](sp).getMyRequests(user.talentRecord.Id)
            .then(function (reqs) {
            var active = reqs.some(function (r) {
                return r.RequestStatus === _services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* RequestStatus */ "e"].Pending ||
                    r.RequestStatus === _services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* RequestStatus */ "e"].Approved ||
                    r.RequestStatus === _services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* RequestStatus */ "e"].HR_Review ||
                    r.RequestStatus === _services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* RequestStatus */ "e"].Scheduled;
            });
            setHasActiveRequests(active);
        })
            .catch(function () { return setHasActiveRequests(true); }); // fallback: show tabs
    }, [sp]);
    react__WEBPACK_IMPORTED_MODULE_0__["useEffect"](function () {
        var roleService = new _services_RoleService__WEBPACK_IMPORTED_MODULE_3__[/* RoleService */ "e"](sp);
        roleService.getCurrentUser()
            .then(function (user) {
            setCurrentUser(user);
            setView(resolveDefaultView(user));
            checkActiveRequests(user);
            if (user.roles.includes(_services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* UserRole */ "n"].Mentor) && user.mentorRecord) {
                new _services_MentoringService__WEBPACK_IMPORTED_MODULE_4__[/* MentoringService */ "e"](sp).getPendingRequestsForMentor(user.mentorRecord.Id)
                    .then(function (items) { if (items.length > 0)
                    setNavBadges({ PendingRequests: items.length }); })
                    .catch(function () { });
            }
        })
            .catch(function (err) { var _a; return setError((_a = err === null || err === void 0 ? void 0 : err.message) !== null && _a !== void 0 ? _a : 'Neznama chyba'); })
            .finally(function () { return setLoading(false); });
    }, [sp, checkActiveRequests]);
    var navigate = react__WEBPACK_IMPORTED_MODULE_0__["useCallback"](function (nextView, params) {
        if (params === void 0) { params = {}; }
        setView(nextView);
        setNavParams(params);
    }, []);
    var handleRequestsChanged = react__WEBPACK_IMPORTED_MODULE_0__["useCallback"](function () {
        if (currentUser)
            checkActiveRequests(currentUser);
    }, [currentUser, checkActiveRequests]);
    if (loading) {
        return react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].auresApp },
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("p", { style: { padding: 16 } }, "Na\u010D\u00EDt\u00E1m..."));
    }
    if (error) {
        return react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].auresApp },
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("p", { style: { padding: 16 } },
                "Chyba p\u0159i inicializaci: ",
                error));
    }
    if (!currentUser || view === 'AccessDenied') {
        return (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].auresApp },
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"](_AccessDenied__WEBPACK_IMPORTED_MODULE_6__[/* default */ "e"], null)));
    }
    return (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].auresApp },
        react__WEBPACK_IMPORTED_MODULE_0__["createElement"](_AppShell__WEBPACK_IMPORTED_MODULE_5__[/* default */ "e"], { currentUser: currentUser, currentView: view, navigate: navigate, navBadges: navBadges, hasActiveRequests: hasActiveRequests }, renderView(view, currentUser, sp, navigate, navParams, hrEmail, handleRequestsChanged))));
};
function resolveDefaultView(user) {
    if (user.roles.includes(_services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* UserRole */ "n"].Unknown) && user.roles.length === 1)
        return 'AccessDenied';
    if (user.roles.includes(_services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* UserRole */ "n"].Talent))
        return 'MentorCatalog';
    if (user.roles.includes(_services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* UserRole */ "n"].Mentor))
        return 'PendingRequests';
    if (user.roles.includes(_services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* UserRole */ "n"].HR))
        return 'AllRequests';
    return 'AccessDenied';
}
function renderView(view, currentUser, sp, navigate, params, hrEmail, onRequestsChanged) {
    switch (view) {
        // Talent
        case 'MentorCatalog': return react__WEBPACK_IMPORTED_MODULE_0__["createElement"](_talent_MentorCatalog__WEBPACK_IMPORTED_MODULE_7__[/* default */ "e"], { sp: sp, currentUser: currentUser, navigate: navigate });
        case 'RequestForm': return react__WEBPACK_IMPORTED_MODULE_0__["createElement"](_talent_RequestForm__WEBPACK_IMPORTED_MODULE_8__[/* default */ "e"], { sp: sp, currentUser: currentUser, navigate: navigate, preselectedMentorId: params.preselectedMentorId });
        case 'MyRequests': return react__WEBPACK_IMPORTED_MODULE_0__["createElement"](_talent_MyRequests__WEBPACK_IMPORTED_MODULE_9__[/* default */ "e"], { sp: sp, currentUser: currentUser, navigate: navigate });
        case 'ResetChoice': return react__WEBPACK_IMPORTED_MODULE_0__["createElement"](_talent_ResetChoice__WEBPACK_IMPORTED_MODULE_10__[/* default */ "e"], { sp: sp, currentUser: currentUser, navigate: navigate, onRequestsChanged: onRequestsChanged });
        // Mentor
        case 'PendingRequests': return react__WEBPACK_IMPORTED_MODULE_0__["createElement"](_mentor_PendingRequests__WEBPACK_IMPORTED_MODULE_11__[/* default */ "e"], { sp: sp, currentUser: currentUser, navigate: navigate });
        case 'RequestDetail': return react__WEBPACK_IMPORTED_MODULE_0__["createElement"](_mentor_RequestDetail__WEBPACK_IMPORTED_MODULE_12__[/* default */ "e"], { sp: sp, currentUser: currentUser, navigate: navigate, requestId: params.requestId, hrEmail: hrEmail });
        case 'RequestHistory': return react__WEBPACK_IMPORTED_MODULE_0__["createElement"](_mentor_RequestHistory__WEBPACK_IMPORTED_MODULE_13__[/* default */ "e"], { sp: sp, currentUser: currentUser, navigate: navigate });
        // HR
        case 'AllRequests': return react__WEBPACK_IMPORTED_MODULE_0__["createElement"](_hr_AllRequests__WEBPACK_IMPORTED_MODULE_14__[/* default */ "e"], { sp: sp, currentUser: currentUser, navigate: navigate });
        case 'ApprovedMentorings': return react__WEBPACK_IMPORTED_MODULE_0__["createElement"](_hr_ApprovedMentorings__WEBPACK_IMPORTED_MODULE_15__[/* default */ "e"], { sp: sp, currentUser: currentUser, navigate: navigate });
        case 'HRReviewQueue': return react__WEBPACK_IMPORTED_MODULE_0__["createElement"](_hr_HRReviewQueue__WEBPACK_IMPORTED_MODULE_16__[/* default */ "e"], { sp: sp, currentUser: currentUser, navigate: navigate });
        case 'MentorManagement': return react__WEBPACK_IMPORTED_MODULE_0__["createElement"](_hr_MentorManagement__WEBPACK_IMPORTED_MODULE_17__[/* default */ "e"], { sp: sp, currentUser: currentUser, navigate: navigate });
        case 'TalentManagement': return react__WEBPACK_IMPORTED_MODULE_0__["createElement"](_hr_TalentManagement__WEBPACK_IMPORTED_MODULE_18__[/* default */ "e"], { sp: sp, currentUser: currentUser, navigate: navigate });
        case 'CapacityDashboard': return react__WEBPACK_IMPORTED_MODULE_0__["createElement"](_hr_CapacityDashboard__WEBPACK_IMPORTED_MODULE_19__[/* default */ "e"], { sp: sp, currentUser: currentUser, navigate: navigate });
        default: return react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", null, "Na\u010D\u00EDt\u00E1m\u2026");
    }
}
/* harmony default export */ __webpack_exports__["e"] = (AuresApp);


/***/ }),

/***/ "SU6V":
/*!**********************************************************!*\
  !*** ./lib/webparts/auresApp/components/AccessDenied.js ***!
  \**********************************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "cDcd");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AuresApp.module.scss */ "sg2l");


var AccessDenied = function () { return (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].accessDenied },
    react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].accessDeniedIcon }, "\uD83D\uDD12"),
    react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("h2", null, "P\u0159\u00EDstup odep\u0159en"),
    react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("p", null, "V\u00E1\u0161 \u00FA\u010Det nen\u00ED registrov\u00E1n jako Talent ani Mentor v syst\u00E9mu Aures Elite Mentoring."),
    react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("p", null, "Kontaktujte HR odd\u011Blen\u00ED Aures Holdings pro p\u0159id\u00E1n\u00ED do syst\u00E9mu."))); };
/* harmony default export */ __webpack_exports__["e"] = (AccessDenied);


/***/ }),

/***/ "SWTO":
/*!********************************************************************!*\
  !*** ./lib/webparts/auresApp/components/mentor/PendingRequests.js ***!
  \********************************************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "cDcd");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../AuresApp.module.scss */ "sg2l");
/* harmony import */ var _services_interfaces__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../services/interfaces */ "FFPM");
/* harmony import */ var _services_MentoringService__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../services/MentoringService */ "39m/");
/* harmony import */ var _utils_mockData__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../utils/mockData */ "IxoJ");





var MOCK_MENTOR_ID = 1; // Jan Novak — fallback pro lokalni dev
var PendingRequests = function (_a) {
    var sp = _a.sp, currentUser = _a.currentUser, navigate = _a.navigate;
    var _b = react__WEBPACK_IMPORTED_MODULE_0__["useState"]([]), requests = _b[0], setRequests = _b[1];
    var _c = react__WEBPACK_IMPORTED_MODULE_0__["useState"](true), loading = _c[0], setLoading = _c[1];
    react__WEBPACK_IMPORTED_MODULE_0__["useEffect"](function () {
        var _a, _b;
        var mentorId = (_b = (_a = currentUser.mentorRecord) === null || _a === void 0 ? void 0 : _a.Id) !== null && _b !== void 0 ? _b : MOCK_MENTOR_ID;
        var mockFallback = _utils_mockData__WEBPACK_IMPORTED_MODULE_4__[/* MOCK_REQUESTS */ "t"].filter(function (r) {
            var _a, _b, _c;
            return r.RequestStatus === _services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* RequestStatus */ "e"].Pending && ((((_a = r.Mentor1Ref) === null || _a === void 0 ? void 0 : _a.Id) === mentorId && r.CurrentStage === 1) ||
                (((_b = r.Mentor2Ref) === null || _b === void 0 ? void 0 : _b.Id) === mentorId && r.CurrentStage === 2) ||
                (((_c = r.Mentor3Ref) === null || _c === void 0 ? void 0 : _c.Id) === mentorId && r.CurrentStage === 3));
        });
        new _services_MentoringService__WEBPACK_IMPORTED_MODULE_3__[/* MentoringService */ "e"](sp).getPendingRequestsForMentor(mentorId)
            .then(setRequests)
            .catch(function () { return setRequests(mockFallback); })
            .finally(function () { return setLoading(false); });
    }, [sp, currentUser]);
    if (loading)
        return react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].loading }, "Na\u010D\u00EDt\u00E1m \u017E\u00E1dosti\u2026");
    return (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", null,
        react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("h2", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].pageTitle }, "\u010Cekaj\u00EDc\u00ED \u017E\u00E1dosti"),
        requests.length === 0 ? (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].emptyState },
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("p", null, "Moment\u00E1ln\u011B na tebe ne\u010Dek\u00E1 \u017E\u00E1dn\u00E1 \u017E\u00E1dost."))) : (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].requestList }, requests.map(function (req) {
            var _a, _b;
            return (react__WEBPACK_IMPORTED_MODULE_0__["createElement"](PendingRow, { key: req.Id, request: req, mentorId: (_b = (_a = currentUser.mentorRecord) === null || _a === void 0 ? void 0 : _a.Id) !== null && _b !== void 0 ? _b : MOCK_MENTOR_ID, onClick: function () { return navigate('RequestDetail', { requestId: req.Id }); } }));
        })))));
};
var PendingRow = function (_a) {
    var request = _a.request, mentorId = _a.mentorId, onClick = _a.onClick;
    var stage = resolveMyStage(request, mentorId);
    var message = stage === 1 ? request.Message1 : stage === 2 ? request.Message2 : request.Message3;
    var preview = message ? message.slice(0, 120) + (message.length > 120 ? '...' : '') : '';
    return (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].pendingRow, onClick: onClick, role: "button", tabIndex: 0 },
        react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].pendingRowLeft },
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].pendingRowHeader },
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("span", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].requestTitle }, request.Title),
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("span", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].stageIndicator },
                    "Mentor #",
                    stage)),
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("p", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].talentName }, request.TalentRef.Title),
            preview && react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("p", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].messagePreview }, preview)),
        react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("span", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].arrowIcon }, "\u203A")));
};
function resolveMyStage(req, mentorId) {
    var _a, _b;
    if (((_a = req.Mentor2Ref) === null || _a === void 0 ? void 0 : _a.Id) === mentorId && req.CurrentStage === 2)
        return 2;
    if (((_b = req.Mentor3Ref) === null || _b === void 0 ? void 0 : _b.Id) === mentorId && req.CurrentStage === 3)
        return 3;
    return 1;
}
/* harmony default export */ __webpack_exports__["e"] = (PendingRequests);


/***/ }),

/***/ "U+bE":
/*!************************************************************!*\
  !*** ./lib/webparts/auresApp/components/hr/AllRequests.js ***!
  \************************************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "cDcd");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../AuresApp.module.scss */ "sg2l");
/* harmony import */ var _services_interfaces__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../services/interfaces */ "FFPM");
/* harmony import */ var _services_MentoringService__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../services/MentoringService */ "39m/");
/* harmony import */ var _utils_mockData__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../utils/mockData */ "IxoJ");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};





var AllRequests = function (_a) {
    var sp = _a.sp, currentUser = _a.currentUser;
    var _b = react__WEBPACK_IMPORTED_MODULE_0__["useState"]([]), requests = _b[0], setRequests = _b[1];
    var _c = react__WEBPACK_IMPORTED_MODULE_0__["useState"](''), search = _c[0], setSearch = _c[1];
    var _d = react__WEBPACK_IMPORTED_MODULE_0__["useState"](true), loading = _d[0], setLoading = _d[1];
    var _e = react__WEBPACK_IMPORTED_MODULE_0__["useState"](null), processing = _e[0], setProcessing = _e[1];
    react__WEBPACK_IMPORTED_MODULE_0__["useEffect"](function () {
        new _services_MentoringService__WEBPACK_IMPORTED_MODULE_3__[/* MentoringService */ "e"](sp).getAllRequests()
            .then(function (all) { return setRequests(all.filter(function (r) {
            return r.RequestStatus === _services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* RequestStatus */ "e"].Pending || r.RequestStatus === _services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* RequestStatus */ "e"].HR_Review;
        })); })
            .catch(function () { return setRequests(_utils_mockData__WEBPACK_IMPORTED_MODULE_4__[/* MOCK_REQUESTS */ "t"].filter(function (r) {
            return r.RequestStatus === _services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* RequestStatus */ "e"].Pending || r.RequestStatus === _services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* RequestStatus */ "e"].HR_Review;
        })); })
            .finally(function () { return setLoading(false); });
    }, [sp]);
    var getCurrentMentor = function (req) {
        if (req.CurrentStage === 1)
            return req.Mentor1Ref;
        if (req.CurrentStage === 2)
            return req.Mentor2Ref;
        if (req.CurrentStage === 3)
            return req.Mentor3Ref;
        return req.Mentor1Ref;
    };
    var getStatusLabel = function (req) {
        var _a;
        if (req.RequestStatus === _services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* RequestStatus */ "e"].HR_Review)
            return 'Čeká na schválení HR';
        var mentor = getCurrentMentor(req);
        return "\u010Cek\u00E1 na schv\u00E1len\u00ED \u2014 ".concat((_a = mentor === null || mentor === void 0 ? void 0 : mentor.Title) !== null && _a !== void 0 ? _a : 'mentor');
    };
    var getStatusClass = function (req) {
        if (req.RequestStatus === _services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* RequestStatus */ "e"].HR_Review)
            return _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].statusHR;
        return _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].statusPending;
    };
    var handleHRApprove = function (req) { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setProcessing(req.Id);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, new _services_MentoringService__WEBPACK_IMPORTED_MODULE_3__[/* MentoringService */ "e"](sp).makeDecision(req.Id, req.CurrentStage, _services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* StageDecision */ "t"].Approved, currentUser.id)];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = _b.sent();
                    return [3 /*break*/, 4];
                case 4:
                    setRequests(function (prev) { return prev.filter(function (r) { return r.Id !== req.Id; }); });
                    setProcessing(null);
                    return [2 /*return*/];
            }
        });
    }); };
    var handleHRSchedule = function (reqId) { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setProcessing(reqId);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, new _services_MentoringService__WEBPACK_IMPORTED_MODULE_3__[/* MentoringService */ "e"](sp).setRequestStatus(reqId, _services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* RequestStatus */ "e"].Scheduled)];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = _b.sent();
                    return [3 /*break*/, 4];
                case 4:
                    setRequests(function (prev) { return prev.filter(function (r) { return r.Id !== reqId; }); });
                    setProcessing(null);
                    return [2 /*return*/];
            }
        });
    }); };
    var handleHRCancel = function (reqId) { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setProcessing(reqId);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, new _services_MentoringService__WEBPACK_IMPORTED_MODULE_3__[/* MentoringService */ "e"](sp).setRequestStatus(reqId, _services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* RequestStatus */ "e"].Cancelled)];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = _b.sent();
                    return [3 /*break*/, 4];
                case 4:
                    setRequests(function (prev) { return prev.filter(function (r) { return r.Id !== reqId; }); });
                    setProcessing(null);
                    return [2 /*return*/];
            }
        });
    }); };
    var filtered = requests.filter(function (r) {
        var _a;
        var q = search.trim().toLowerCase();
        if (!q)
            return true;
        var mentor = getCurrentMentor(r);
        return r.TalentRef.Title.toLowerCase().includes(q)
            || ((_a = mentor === null || mentor === void 0 ? void 0 : mentor.Title) !== null && _a !== void 0 ? _a : '').toLowerCase().includes(q);
    });
    if (loading)
        return react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].loading }, "Na\u010D\u00EDt\u00E1m \u017E\u00E1dosti\u2026");
    return (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", null,
        react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("h2", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].pageTitle },
            "\u010Cekaj\u00EDc\u00ED \u017E\u00E1dosti (",
            requests.length,
            ")"),
        react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].filterRow },
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("input", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].searchInput, type: "text", placeholder: "Hledat talent nebo mentora\u2026", value: search, onChange: function (e) { return setSearch(e.target.value); } })),
        filtered.length === 0 ? (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].emptyState },
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("p", null, "\u017D\u00E1dn\u00E9 \u017E\u00E1dosti ne\u010Dekaj\u00ED na vy\u0159\u00EDzen\u00ED."))) : (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].requestList }, filtered.map(function (req) {
            var _a;
            var mentor = getCurrentMentor(req);
            var isProcessing = processing === req.Id;
            var isHRReview = req.RequestStatus === _services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* RequestStatus */ "e"].HR_Review;
            return (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { key: req.Id, className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].hrRequestRow },
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].hrRequestMain },
                    react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].hrRequestNames },
                        react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("span", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].hrRequestTalent }, req.TalentRef.Title),
                        react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("span", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].hrRequestArrow }, "\u2192"),
                        react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("span", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].hrRequestMentor }, (_a = mentor === null || mentor === void 0 ? void 0 : mentor.Title) !== null && _a !== void 0 ? _a : '—')),
                    react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("span", { className: [_AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].statusBadge, getStatusClass(req)].join(' ') }, getStatusLabel(req))),
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].hrRequestActions },
                    isHRReview ? (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("button", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].hrActionBtn, disabled: isProcessing, onClick: function () { void handleHRSchedule(req.Id); }, title: "Napl\u00E1novat mentoring" }, "Napl\u00E1novat")) : (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("button", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].hrActionBtn, disabled: isProcessing, onClick: function () { void handleHRApprove(req); }, title: "Schv\u00E1lit za mentora" }, "Schv\u00E1lit")),
                    react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("button", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].hrActionBtnDanger, disabled: isProcessing, onClick: function () { void handleHRCancel(req.Id); }, title: "Zru\u0161it \u017E\u00E1dost" }, "Zru\u0161it"))));
        })))));
};
/* harmony default export */ __webpack_exports__["e"] = (AllRequests);


/***/ }),

/***/ "UKGb":
/*!***************************************!*\
  !*** ./node_modules/@pnp/sp/index.js ***!
  \***************************************/
/*! exports provided: spInvokableFactory, _SPQueryable, SPQueryable, _SPCollection, SPCollection, _SPInstance, SPInstance, deleteable, deleteableWithETag, spGet, spPost, spPostMerge, spPostDelete, spPostDeleteETag, spDelete, spPatch, InitialFieldQuery, ComparisonResult, defaultPath, SPFI, spfi, emptyGuid, PrincipalType, PrincipalSource, PageType, createChangeToken, extractWebUrl, containsInvalidFileFolderChars, stripInvalidFileFolderChars, odataUrlFrom, toResourcePath, encodePath, encodePathNoURIEncode, DefaultInit, DefaultHeaders, Telemetry, RequestDigest, SPBrowser, SPFxToken, SPFx */
/*! exports used: extractWebUrl, spfi */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _spqueryable_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./spqueryable.js */ "F4qD");
/* harmony import */ var _decorators_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./decorators.js */ "hMpi");
/* harmony import */ var _fi_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./fi.js */ "v6VW");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "t", function() { return _fi_js__WEBPACK_IMPORTED_MODULE_2__["t"]; });

/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./types.js */ "tCQJ");
/* harmony import */ var _utils_create_change_token_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/create-change-token.js */ "lZLn");
/* harmony import */ var _utils_extract_web_url_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/extract-web-url.js */ "OXUt");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "e", function() { return _utils_extract_web_url_js__WEBPACK_IMPORTED_MODULE_5__["e"]; });

/* harmony import */ var _utils_file_names_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils/file-names.js */ "YFzv");
/* harmony import */ var _utils_odata_url_from_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./utils/odata-url-from.js */ "hTrG");
/* harmony import */ var _utils_to_resource_path_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./utils/to-resource-path.js */ "G6u6");
/* harmony import */ var _utils_encode_path_str_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./utils/encode-path-str.js */ "vbtm");
/* harmony import */ var _behaviors_defaults_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./behaviors/defaults.js */ "qZw7");
/* harmony import */ var _behaviors_telemetry_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./behaviors/telemetry.js */ "nikm");
/* harmony import */ var _behaviors_request_digest_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./behaviors/request-digest.js */ "GfGO");
/* harmony import */ var _behaviors_spbrowser_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./behaviors/spbrowser.js */ "Wjh3");
/* harmony import */ var _behaviors_spfx_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./behaviors/spfx.js */ "OWTB");















//# sourceMappingURL=index.js.map

/***/ }),

/***/ "UWqr":
/*!*********************************************!*\
  !*** external "@microsoft/sp-core-library" ***!
  \*********************************************/
/*! no static exports found */
/*! exports used: Version */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_UWqr__;

/***/ }),

/***/ "UuUm":
/*!***************************************************!*\
  !*** ./node_modules/@pnp/sp/site-groups/types.js ***!
  \***************************************************/
/*! exports provided: _SiteGroups, SiteGroups, _SiteGroup, SiteGroup */
/*! exports used: SiteGroups */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export _SiteGroups */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return SiteGroups; });
/* unused harmony export _SiteGroup */
/* unused harmony export SiteGroup */
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "LVfT");
/* harmony import */ var _spqueryable_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../spqueryable.js */ "F4qD");
/* harmony import */ var _site_users_types_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../site-users/types.js */ "y+KB");
/* harmony import */ var _pnp_queryable__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @pnp/queryable */ "Ymo3");
/* harmony import */ var _decorators_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../decorators.js */ "hMpi");





let _SiteGroups = class _SiteGroups extends _spqueryable_js__WEBPACK_IMPORTED_MODULE_1__[/* _SPCollection */ "a"] {
    /**
     * Gets a group from the collection by id
     *
     * @param id The id of the group to retrieve
     */
    getById(id) {
        return SiteGroup(this).concat(`(${id})`);
    }
    /**
     * Adds a new group to the site collection
     *
     * @param properties The group properties object of property names and values to be set for the group
     */
    async add(properties) {
        return Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_1__[/* spPost */ "d"])(this, Object(_pnp_queryable__WEBPACK_IMPORTED_MODULE_3__[/* body */ "d"])(properties));
    }
    /**
     * Gets a group from the collection by name
     *
     * @param groupName The name of the group to retrieve
     */
    getByName(groupName) {
        return SiteGroup(this, `getByName('${groupName}')`);
    }
    /**
     * Removes the group with the specified member id from the collection
     *
     * @param id The id of the group to remove
     */
    removeById(id) {
        return Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_1__[/* spPost */ "d"])(SiteGroups(this, `removeById('${id}')`));
    }
    /**
     * Removes the cross-site group with the specified name from the collection
     *
     * @param loginName The name of the group to remove
     */
    removeByLoginName(loginName) {
        return Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_1__[/* spPost */ "d"])(SiteGroups(this, `removeByLoginName('${loginName}')`));
    }
};
_SiteGroups = Object(tslib__WEBPACK_IMPORTED_MODULE_0__[/* __decorate */ "e"])([
    Object(_decorators_js__WEBPACK_IMPORTED_MODULE_4__[/* defaultPath */ "e"])("sitegroups")
], _SiteGroups);

const SiteGroups = Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_1__[/* spInvokableFactory */ "c"])(_SiteGroups);
class _SiteGroup extends _spqueryable_js__WEBPACK_IMPORTED_MODULE_1__[/* _SPInstance */ "i"] {
    /**
     * Gets the users for this group
     *
     */
    get users() {
        return Object(_site_users_types_js__WEBPACK_IMPORTED_MODULE_2__[/* SiteUsers */ "t"])(this, "users");
    }
    /**
    * @param props Group properties to update
    */
    async update(props) {
        return Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_1__[/* spPostMerge */ "l"])(this, Object(_pnp_queryable__WEBPACK_IMPORTED_MODULE_3__[/* body */ "d"])(props));
    }
    /**
     * Set the owner of a group using a user id
     * @param userId the id of the user that will be set as the owner of the current group
     */
    setUserAsOwner(userId) {
        return Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_1__[/* spPost */ "d"])(SiteGroup(this, `SetUserAsOwner(${userId})`));
    }
}
const SiteGroup = Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_1__[/* spInvokableFactory */ "c"])(_SiteGroup);
//# sourceMappingURL=types.js.map

/***/ }),

/***/ "VJuY":
/*!****************************************************************!*\
  !*** ./lib/webparts/auresApp/components/talent/ResetChoice.js ***!
  \****************************************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "cDcd");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../AuresApp.module.scss */ "sg2l");
/* harmony import */ var _services_MentoringService__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../services/MentoringService */ "39m/");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};



var ResetChoice = function (_a) {
    var sp = _a.sp, currentUser = _a.currentUser, navigate = _a.navigate, onRequestsChanged = _a.onRequestsChanged;
    var _b = react__WEBPACK_IMPORTED_MODULE_0__["useState"](false), resetting = _b[0], setResetting = _b[1];
    var _c = react__WEBPACK_IMPORTED_MODULE_0__["useState"](false), done = _c[0], setDone = _c[1];
    var handleReset = function () { return __awaiter(void 0, void 0, void 0, function () {
        var talentId, _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    talentId = (_b = currentUser.talentRecord) === null || _b === void 0 ? void 0 : _b.Id;
                    if (!talentId)
                        return [2 /*return*/];
                    setResetting(true);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, new _services_MentoringService__WEBPACK_IMPORTED_MODULE_2__[/* MentoringService */ "e"](sp).cancelAllRequestsForTalent(talentId)];
                case 2:
                    _c.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = _c.sent();
                    return [3 /*break*/, 4];
                case 4:
                    setDone(true);
                    setResetting(false);
                    onRequestsChanged();
                    return [2 /*return*/];
            }
        });
    }); };
    if (done) {
        return (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].emptyState },
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("p", null, "Tvoje volba byla resetov\u00E1na. M\u016F\u017Ee\u0161 si znovu vybrat mentora z katalogu."),
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("button", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].btnPrimary, style: { marginTop: 16 }, onClick: function () { return navigate('MentorCatalog'); } }, "P\u0159ej\u00EDt na katalog mentor\u016F")));
    }
    return (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", null,
        react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("h2", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].pageTitle }, "Zm\u011Bna volby mentora"),
        react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].resetChoiceCard },
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("p", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].resetChoiceText }, "Pokud chce\u0161 zm\u011Bnit svou volbu mentora, m\u016F\u017Ee\u0161 zde zru\u0161it v\u0161echny aktu\u00E1ln\u00ED \u017E\u00E1dosti a za\u010D\u00EDt v\u00FDb\u011Br od za\u010D\u00E1tku. Syst\u00E9m zru\u0161\u00ED v\u0161echny tvoje aktivn\u00ED \u017E\u00E1dosti a bude\u0161 si moci znovu vybrat mentora z katalogu."),
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("p", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].resetChoiceWarning }, "Tato akce je nevratn\u00E1 \u2014 v\u0161echny tvoje aktu\u00E1ln\u00ED \u017E\u00E1dosti budou zru\u0161eny."),
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("button", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].btnReject, onClick: function () { void handleReset(); }, disabled: resetting }, resetting ? 'Ruším žádosti…' : 'Resetovat volbu a začít znovu'))));
};
/* harmony default export */ __webpack_exports__["e"] = (ResetChoice);


/***/ }),

/***/ "VxMn":
/*!**********************************************************!*\
  !*** ./node_modules/@pnp/queryable/behaviors/caching.js ***!
  \**********************************************************/
/*! exports provided: CacheAlways, CacheNever, CacheKey, Caching, bindCachingCore */
/*! exports used: bindCachingCore */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export CacheAlways */
/* unused harmony export CacheNever */
/* unused harmony export CacheKey */
/* unused harmony export Caching */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return bindCachingCore; });
/* harmony import */ var _pnp_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @pnp/core */ "JC1J");

/**
 * Behavior that forces caching for the request regardless of "method"
 *
 * @returns TimelinePipe
 */
function CacheAlways() {
    return (instance) => {
        instance.on.pre.prepend(async function (url, init, result) {
            init.headers = { ...init.headers, "X-PnP-CacheAlways": "1" };
            return [url, init, result];
        });
        return instance;
    };
}
/**
 * Behavior that blocks caching for the request regardless of "method"
 *
 * Note: If both Caching and CacheAlways are present AND CacheNever is present the request will not be cached
 * as we give priority to the CacheNever case
 *
 * @returns TimelinePipe
 */
function CacheNever() {
    return (instance) => {
        instance.on.pre.prepend(async function (url, init, result) {
            init.headers = { ...init.headers, "X-PnP-CacheNever": "1" };
            return [url, init, result];
        });
        return instance;
    };
}
/**
 * Behavior that allows you to specify a cache key for a request
 *
 * @param key The key to use for caching
  */
function CacheKey(key) {
    return (instance) => {
        instance.on.pre.prepend(async function (url, init, result) {
            init.headers = { ...init.headers, "X-PnP-CacheKey": key };
            return [url, init, result];
        });
        return instance;
    };
}
/**
 * Adds caching to the requests based on the supplied props
 *
 * @param props Optional props that configure how caching will work
 * @returns TimelinePipe used to configure requests
 */
function Caching(props) {
    return (instance) => {
        instance.on.pre(async function (url, init, result) {
            const [shouldCache, getCachedValue, setCachedValue] = bindCachingCore(url, init, props);
            // only cache get requested data or where the CacheAlways header is present (allows caching of POST requests)
            if (shouldCache) {
                const cached = getCachedValue();
                // we need to ensure that result stays "undefined" unless we mean to set null as the result
                if (cached === null) {
                    // if we don't have a cached result we need to get it after the request is sent. Get the raw value (un-parsed) to store into cache
                    this.on.post(Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* noInherit */ "b"])(async function (url, result) {
                        setCachedValue(result);
                        return [url, result];
                    }));
                }
                else {
                    result = cached;
                }
            }
            return [url, init, result];
        });
        return instance;
    };
}
const storage = new _pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* PnPClientStorage */ "t"]();
/**
 * Based on the supplied properties, creates bound logic encapsulating common caching configuration
 * sharable across implementations to more easily provide consistent behavior across behaviors
 *
 * @param props Any caching props used to initialize the core functions
 */
function bindCachingCore(url, init, props) {
    var _a, _b;
    const { store, keyFactory, expireFunc } = {
        store: "local",
        keyFactory: (url) => Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* getHashCode */ "l"])(url.toLowerCase()).toString(),
        expireFunc: () => Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* dateAdd */ "s"])(new Date(), "minute", 5),
        ...props,
    };
    const s = store === "session" ? storage.session : storage.local;
    const key = (init === null || init === void 0 ? void 0 : init.headers["X-PnP-CacheKey"]) ? init.headers["X-PnP-CacheKey"] : keyFactory(url);
    return [
        // calculated value indicating if we should cache this request
        (/get/i.test(init.method) || ((_a = init === null || init === void 0 ? void 0 : init.headers["X-PnP-CacheAlways"]) !== null && _a !== void 0 ? _a : false)) && !((_b = init === null || init === void 0 ? void 0 : init.headers["X-PnP-CacheNever"]) !== null && _b !== void 0 ? _b : false),
        // gets the cached value
        () => s.get(key),
        // sets the cached value
        (value) => s.put(key, value, expireFunc(url)),
    ];
}
//# sourceMappingURL=caching.js.map

/***/ }),

/***/ "WE4i":
/*!***************************************************************!*\
  !*** ./node_modules/@pnp/queryable/behaviors/bearer-token.js ***!
  \***************************************************************/
/*! exports provided: BearerToken */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export BearerToken */
/* harmony import */ var _inject_headers_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./inject-headers.js */ "XOGp");

function BearerToken(token) {
    return (instance) => {
        instance.using(Object(_inject_headers_js__WEBPACK_IMPORTED_MODULE_0__[/* InjectHeaders */ "e"])({
            "Authorization": `Bearer ${token}`,
        }));
        return instance;
    };
}
//# sourceMappingURL=bearer-token.js.map

/***/ }),

/***/ "WEcB":
/*!*******************************************************************!*\
  !*** ./lib/webparts/auresApp/components/mentor/RequestHistory.js ***!
  \*******************************************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "cDcd");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../AuresApp.module.scss */ "sg2l");
/* harmony import */ var _services_interfaces__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../services/interfaces */ "FFPM");
/* harmony import */ var _services_MentoringService__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../services/MentoringService */ "39m/");
/* harmony import */ var _utils_mockData__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../utils/mockData */ "IxoJ");





var MOCK_MENTOR_ID = 1; // Jan Novak — fallback pro lokalni dev
var RequestHistory = function (_a) {
    var sp = _a.sp, currentUser = _a.currentUser;
    var _b = react__WEBPACK_IMPORTED_MODULE_0__["useState"]([]), requests = _b[0], setRequests = _b[1];
    var _c = react__WEBPACK_IMPORTED_MODULE_0__["useState"](true), loading = _c[0], setLoading = _c[1];
    react__WEBPACK_IMPORTED_MODULE_0__["useEffect"](function () {
        var _a, _b;
        var mentorId = (_b = (_a = currentUser.mentorRecord) === null || _a === void 0 ? void 0 : _a.Id) !== null && _b !== void 0 ? _b : MOCK_MENTOR_ID;
        // Fallback: zadosti kde mentor rozhodoval (ma zaznam Stage*DecisionBy nebo je v MentorXRef)
        var mockFallback = _utils_mockData__WEBPACK_IMPORTED_MODULE_4__[/* MOCK_REQUESTS */ "t"].filter(function (r) {
            var _a, _b, _c;
            return (((_a = r.Mentor1Ref) === null || _a === void 0 ? void 0 : _a.Id) === mentorId && r.Stage1Decision != null) ||
                (((_b = r.Mentor2Ref) === null || _b === void 0 ? void 0 : _b.Id) === mentorId && r.Stage2Decision != null) ||
                (((_c = r.Mentor3Ref) === null || _c === void 0 ? void 0 : _c.Id) === mentorId && r.Stage3Decision != null);
        });
        new _services_MentoringService__WEBPACK_IMPORTED_MODULE_3__[/* MentoringService */ "e"](sp).getRequestHistoryForMentor(mentorId)
            .then(setRequests)
            .catch(function () { return setRequests(mockFallback); })
            .finally(function () { return setLoading(false); });
    }, [sp, currentUser]);
    if (loading)
        return react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].loading }, "Na\u010D\u00EDt\u00E1m historii\u2026");
    return (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", null,
        react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("h2", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].pageTitle }, "Moje rozhodnuti"),
        requests.length === 0 ? (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].emptyState },
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("p", null, "Zat\u00EDm jsi nerozhodoval \u017E\u00E1dn\u00E9 \u017E\u00E1dosti."))) : (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].requestList }, requests.map(function (req) {
            var _a, _b;
            return (react__WEBPACK_IMPORTED_MODULE_0__["createElement"](HistoryRow, { key: req.Id, request: req, mentorId: (_b = (_a = currentUser.mentorRecord) === null || _a === void 0 ? void 0 : _a.Id) !== null && _b !== void 0 ? _b : MOCK_MENTOR_ID }));
        })))));
};
var HistoryRow = function (_a) {
    var _b;
    var request = _a.request, mentorId = _a.mentorId;
    var myDecision = resolveMyDecision(request, mentorId);
    var decisionDate = myDecision ? formatDate(getDecisionDate(request, myDecision.stage)) : '';
    return (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].historyCard },
        react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].historyLeft },
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("p", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].historyTitle },
                request.Title,
                " \u2014 ",
                request.TalentRef.Title),
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("p", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].historyMeta },
                "Mentor #", (_b = myDecision === null || myDecision === void 0 ? void 0 : myDecision.stage) !== null && _b !== void 0 ? _b : '?',
                decisionDate ? " \u00B7 ".concat(decisionDate) : '')),
        myDecision && (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("span", { className: [
                _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].decisionBadge,
                myDecision.decision === _services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* StageDecision */ "t"].Approved ? _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].decisionApproved : _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].decisionRejected
            ].join(' ') }, myDecision.decision === _services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* StageDecision */ "t"].Approved ? 'Schváleno' : 'Zamítnuto'))));
};
// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------
function resolveMyDecision(req, mentorId) {
    var _a, _b, _c;
    if (((_a = req.Mentor1Ref) === null || _a === void 0 ? void 0 : _a.Id) === mentorId && req.Stage1Decision != null)
        return { stage: 1, decision: req.Stage1Decision };
    if (((_b = req.Mentor2Ref) === null || _b === void 0 ? void 0 : _b.Id) === mentorId && req.Stage2Decision != null)
        return { stage: 2, decision: req.Stage2Decision };
    if (((_c = req.Mentor3Ref) === null || _c === void 0 ? void 0 : _c.Id) === mentorId && req.Stage3Decision != null)
        return { stage: 3, decision: req.Stage3Decision };
    return undefined;
}
function getDecisionDate(req, stage) {
    if (stage === 1)
        return req.Stage1DecisionDate;
    if (stage === 2)
        return req.Stage2DecisionDate;
    return req.Stage3DecisionDate;
}
function formatDate(iso) {
    if (!iso)
        return '';
    try {
        return new Date(iso).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });
    }
    catch (_a) {
        return iso;
    }
}
/* harmony default export */ __webpack_exports__["e"] = (RequestHistory);


/***/ }),

/***/ "Wjh3":
/*!*****************************************************!*\
  !*** ./node_modules/@pnp/sp/behaviors/spbrowser.js ***!
  \*****************************************************/
/*! exports provided: SPBrowser */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export SPBrowser */
/* harmony import */ var _pnp_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @pnp/core */ "JC1J");
/* harmony import */ var _pnp_queryable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @pnp/queryable */ "Ymo3");
/* harmony import */ var _defaults_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./defaults.js */ "qZw7");
/* harmony import */ var _request_digest_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./request-digest.js */ "GfGO");




function SPBrowser(props) {
    if ((props === null || props === void 0 ? void 0 : props.baseUrl) && !Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* isUrlAbsolute */ "m"])(props.baseUrl)) {
        throw Error("SPBrowser props.baseUrl must be absolute when supplied.");
    }
    return (instance) => {
        instance.using(Object(_defaults_js__WEBPACK_IMPORTED_MODULE_2__[/* DefaultHeaders */ "e"])(), Object(_defaults_js__WEBPACK_IMPORTED_MODULE_2__[/* DefaultInit */ "t"])(), Object(_pnp_queryable__WEBPACK_IMPORTED_MODULE_1__[/* BrowserFetchWithRetry */ "e"])(), Object(_pnp_queryable__WEBPACK_IMPORTED_MODULE_1__[/* DefaultParse */ "t"])(), Object(_request_digest_js__WEBPACK_IMPORTED_MODULE_3__[/* RequestDigest */ "e"])());
        if (Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* isUrlAbsolute */ "m"])(props === null || props === void 0 ? void 0 : props.baseUrl)) {
            // we want to fix up the url first
            instance.on.pre.prepend(async (url, init, result) => {
                if (!Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* isUrlAbsolute */ "m"])(url)) {
                    url = Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* combine */ "o"])(props.baseUrl, url);
                }
                return [url, init, result];
            });
        }
        return instance;
    };
}
//# sourceMappingURL=spbrowser.js.map

/***/ }),

/***/ "Ww49":
/*!**************************************************!*\
  !*** ./node_modules/@pnp/queryable/queryable.js ***!
  \**************************************************/
/*! exports provided: Queryable, get, post, put, patch, del, op, queryableFactory, invokable */
/*! exports used: Queryable, del, get, op, patch, post, queryableFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return Queryable; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return get; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "r", function() { return post; });
/* unused harmony export put */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return patch; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "t", function() { return del; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return op; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "o", function() { return queryableFactory; });
/* unused harmony export invokable */
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "IwJs");
/* harmony import */ var _pnp_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @pnp/core */ "JC1J");


const DefaultMoments = {
    construct: Object(_pnp_core__WEBPACK_IMPORTED_MODULE_1__[/* lifecycle */ "h"])(),
    pre: Object(_pnp_core__WEBPACK_IMPORTED_MODULE_1__[/* asyncReduce */ "i"])(),
    auth: Object(_pnp_core__WEBPACK_IMPORTED_MODULE_1__[/* asyncReduce */ "i"])(),
    send: Object(_pnp_core__WEBPACK_IMPORTED_MODULE_1__[/* request */ "y"])(),
    parse: Object(_pnp_core__WEBPACK_IMPORTED_MODULE_1__[/* asyncReduce */ "i"])(),
    post: Object(_pnp_core__WEBPACK_IMPORTED_MODULE_1__[/* asyncReduce */ "i"])(),
    data: Object(_pnp_core__WEBPACK_IMPORTED_MODULE_1__[/* broadcast */ "r"])(),
};
let Queryable = class Queryable extends _pnp_core__WEBPACK_IMPORTED_MODULE_1__[/* Timeline */ "n"] {
    constructor(init, path) {
        super(DefaultMoments);
        // these keys represent internal events for Queryable, users are not expected to
        // subscribe directly to these, rather they enable functionality within Queryable
        // they are Symbols such that there are NOT cloned between queryables as we only grab string keys (by design)
        this.InternalResolve = Symbol.for("Queryable_Resolve");
        this.InternalReject = Symbol.for("Queryable_Reject");
        this.InternalPromise = Symbol.for("Queryable_Promise");
        // default to use the included URL search params to parse the query string
        this._query = new URLSearchParams();
        // add an internal moment with specific implementation for promise creation
        this.moments[this.InternalPromise] = Object(_pnp_core__WEBPACK_IMPORTED_MODULE_1__[/* reduce */ "v"])();
        let parent;
        if (typeof init === "string") {
            this._url = Object(_pnp_core__WEBPACK_IMPORTED_MODULE_1__[/* combine */ "o"])(init, path);
        }
        else if (Object(_pnp_core__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "f"])(init)) {
            if (init.length !== 2) {
                throw Error("When using the tuple param exactly two arguments are expected.");
            }
            if (typeof init[1] !== "string") {
                throw Error("Expected second tuple param to be a string.");
            }
            parent = init[0];
            this._url = Object(_pnp_core__WEBPACK_IMPORTED_MODULE_1__[/* combine */ "o"])(init[1], path);
        }
        else {
            parent = init;
            this._url = Object(_pnp_core__WEBPACK_IMPORTED_MODULE_1__[/* combine */ "o"])(parent._url, path);
        }
        if (typeof parent !== "undefined") {
            this.observers = parent.observers;
            this._inheritingObservers = true;
        }
    }
    /**
     * Directly concatenates the supplied string to the current url, not normalizing "/" chars
     *
     * @param pathPart The string to concatenate to the url
     */
    concat(pathPart) {
        this._url += pathPart;
        return this;
    }
    /**
     * Gets the full url with query information
     *
     */
    toRequestUrl() {
        let url = this.toUrl();
        const query = this.query.toString();
        if (!Object(_pnp_core__WEBPACK_IMPORTED_MODULE_1__[/* stringIsNullOrEmpty */ "S"])(query)) {
            url += `${url.indexOf("?") > -1 ? "&" : "?"}${query}`;
        }
        return url;
    }
    /**
     * Querystring key, value pairs which will be included in the request
     */
    get query() {
        return this._query;
    }
    /**
     * Gets the current url
     *
     */
    toUrl() {
        return this._url;
    }
    execute(userInit) {
        // if there are NO observers registered this is likely either a bug in the library or a user error, direct to docs
        if (Reflect.ownKeys(this.observers).length < 1) {
            throw Error("No observers registered for this request. (https://pnp.github.io/pnpjs/queryable/queryable#no-observers-registered-for-this-request)");
        }
        // schedule the execution after we return the promise below in the next event loop
        setTimeout(async () => {
            const requestId = Object(_pnp_core__WEBPACK_IMPORTED_MODULE_1__[/* getGUID */ "d"])();
            let requestUrl;
            const log = (msg, level) => {
                // this allows us to easily and consistently format our messages
                this.log(`[${requestId}] ${msg}`, level);
            };
            try {
                log("Beginning request", 0);
                // include the request id in the headers to assist with debugging against logs
                const initSeed = {
                    ...userInit,
                    headers: { ...userInit.headers, "X-PnPjs-RequestId": requestId },
                };
                // eslint-disable-next-line prefer-const
                let [url, init, result] = await this.emit.pre(this.toRequestUrl(), initSeed, undefined);
                log(`Url: ${url}`, 1);
                if (typeof result !== "undefined") {
                    log("Result returned from pre, Emitting data");
                    this.emit.data(result);
                    log("Emitted data");
                    return;
                }
                log("Emitting auth");
                [requestUrl, init] = await this.emit.auth(new URL(url), init);
                log("Emitted auth");
                // we always resepect user supplied init over observer modified init
                init = { ...init, ...userInit, headers: { ...init.headers, ...userInit.headers } };
                log("Emitting send");
                let response = await this.emit.send(requestUrl, init);
                log("Emitted send");
                log("Emitting parse");
                [requestUrl, response, result] = await this.emit.parse(requestUrl, response, result);
                log("Emitted parse");
                log("Emitting post");
                [requestUrl, result] = await this.emit.post(requestUrl, result);
                log("Emitted post");
                log("Emitting data");
                this.emit.data(result);
                log("Emitted data");
            }
            catch (e) {
                log(`Emitting error: "${e.message || e}"`, 3);
                // anything that throws we emit and continue
                this.error(e);
                log("Emitted error", 3);
            }
            finally {
                log("Finished request", 0);
            }
        }, 0);
        // this allows us to internally hook the promise creation and modify it. This was introduced to allow for
        // cancelable to work as envisioned, but may have other users. Meant for internal use in the library accessed via behaviors.
        return this.emit[this.InternalPromise](new Promise((resolve, reject) => {
            // we overwrite any pre-existing internal events as a
            // given queryable only processes a single request at a time
            this.on[this.InternalResolve].replace(resolve);
            this.on[this.InternalReject].replace(reject);
        }))[0];
    }
};
Queryable = Object(tslib__WEBPACK_IMPORTED_MODULE_0__[/* __decorate */ "e"])([
    invokable()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
], Queryable);

function ensureInit(method, init = { headers: {} }) {
    return { method, ...init, headers: { ...init.headers } };
}
function get(init) {
    return this.start(ensureInit("GET", init));
}
function post(init) {
    return this.start(ensureInit("POST", init));
}
function put(init) {
    return this.start(ensureInit("PUT", init));
}
function patch(init) {
    return this.start(ensureInit("PATCH", init));
}
function del(init) {
    return this.start(ensureInit("DELETE", init));
}
function op(q, operation, init) {
    return Reflect.apply(operation, q, [init]);
}
function queryableFactory(constructor) {
    return (init, path) => {
        // construct the concrete instance
        const instance = new constructor(init, path);
        // we emit the construct event from the factory because we need all of the decorators and constructors
        // to have fully finished before we emit, which is now true. We type the instance to any to get around
        // the protected nature of emit
        instance.emit.construct(init, path);
        return instance;
    };
}
/**
 * Allows a decorated object to be invoked as a function, optionally providing an implementation for that action
 *
 * @param invokeableAction Optional. The logic to execute upon invoking the object as a function.
 * @returns Decorator which applies the invokable logic to the tagged class
 */
function invokable(invokeableAction) {
    return (target) => {
        return new Proxy(target, {
            construct(clz, args, newTarget) {
                const invokableInstance = Object.assign(function (init) {
                    if (!Object(_pnp_core__WEBPACK_IMPORTED_MODULE_1__[/* isFunc */ "p"])(invokeableAction)) {
                        invokeableAction = function (init) {
                            return op(this, get, init);
                        };
                    }
                    return Reflect.apply(invokeableAction, invokableInstance, [init]);
                }, Reflect.construct(clz, args, newTarget));
                Reflect.setPrototypeOf(invokableInstance, newTarget.prototype);
                return invokableInstance;
            },
        });
    };
}
//# sourceMappingURL=queryable.js.map

/***/ }),

/***/ "XOGp":
/*!*****************************************************************!*\
  !*** ./node_modules/@pnp/queryable/behaviors/inject-headers.js ***!
  \*****************************************************************/
/*! exports provided: InjectHeaders */
/*! exports used: InjectHeaders */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return InjectHeaders; });
function InjectHeaders(headers, prepend = false) {
    return (instance) => {
        const f = async function (url, init, result) {
            init.headers = { ...init.headers, ...headers };
            return [url, init, result];
        };
        if (prepend) {
            instance.on.pre.prepend(f);
        }
        else {
            instance.on.pre(f);
        }
        return instance;
    };
}
//# sourceMappingURL=inject-headers.js.map

/***/ }),

/***/ "XeuW":
/*!******************************************************************!*\
  !*** ./lib/webparts/auresApp/components/talent/MentorCatalog.js ***!
  \******************************************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "cDcd");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../AuresApp.module.scss */ "sg2l");
/* harmony import */ var _services_MentoringService__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../services/MentoringService */ "39m/");
/* harmony import */ var _utils_mockData__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../utils/mockData */ "IxoJ");




var MentorCatalog = function (_a) {
    var sp = _a.sp, navigate = _a.navigate;
    var _b = react__WEBPACK_IMPORTED_MODULE_0__["useState"]([]), mentors = _b[0], setMentors = _b[1];
    var _c = react__WEBPACK_IMPORTED_MODULE_0__["useState"](true), loading = _c[0], setLoading = _c[1];
    react__WEBPACK_IMPORTED_MODULE_0__["useEffect"](function () {
        new _services_MentoringService__WEBPACK_IMPORTED_MODULE_2__[/* MentoringService */ "e"](sp).getMentors()
            .then(setMentors)
            .catch(function () { return setMentors(_utils_mockData__WEBPACK_IMPORTED_MODULE_3__[/* MOCK_MENTORS */ "e"].filter(function (m) { return m.IsActive; })); })
            .finally(function () { return setLoading(false); });
    }, [sp]);
    if (loading)
        return react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].loading }, "Na\u010D\u00EDt\u00E1m mentory\u2026");
    if (!mentors.length) {
        return (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].emptyState },
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("p", null, "Moment\u00E1ln\u011B nejsou k dispozici \u017E\u00E1dn\u00ED aktivn\u00ED mento\u0159i.")));
    }
    return (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", null,
        react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("h2", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].pageTitle }, "Katalog mentor\u016F"),
        react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].mentorGrid }, mentors.map(function (mentor) { return (react__WEBPACK_IMPORTED_MODULE_0__["createElement"](MentorCard, { key: mentor.Id, mentor: mentor, onRequest: function () { return navigate('RequestForm', { preselectedMentorId: mentor.Id }); } })); }))));
};
var MentorCard = function (_a) {
    var mentor = _a.mentor, onRequest = _a.onRequest;
    var _b = react__WEBPACK_IMPORTED_MODULE_0__["useState"](false), expanded = _b[0], setExpanded = _b[1];
    // Split bio on "\n\nNejvětší překonaná výzva:" to separate bio and challenge
    var bioChallengeSplit = mentor.Bio.split('\n\nNejvětší překonaná výzva:');
    var bioText = bioChallengeSplit[0];
    var challengeText = bioChallengeSplit.length > 1 ? bioChallengeSplit[1].trim() : '';
    // Short bio: first ~2 sentences
    var shortBio = bioText.split(/(?<=\.)\s+/).slice(0, 2).join(' ');
    var hasMore = bioText.length > shortBio.length || challengeText.length > 0;
    var avatarClass = mentor.PhotoUrl
        ? "".concat(_AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].mentorAvatar, " ").concat(_AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].mentorAvatarPhoto)
        : _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].mentorAvatar;
    var avatarStyle = mentor.PhotoUrl
        ? { backgroundImage: "url('".concat(mentor.PhotoUrl, "')") }
        : undefined;
    return (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].mentorCard },
        react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].mentorCardHeader },
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: avatarClass, style: avatarStyle }, !mentor.PhotoUrl && getInitials(mentor.Title)),
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", null,
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("p", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].mentorName }, mentor.Title),
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("p", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].mentorJobTitle }, mentor.JobTitle))),
        react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("p", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].mentorSuperpower }, mentor.Superpower),
        react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("p", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].mentorBio }, shortBio),
        hasMore && (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].mentorDetails },
            !expanded && (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("button", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].mentorDetailsToggle, onClick: function () { return setExpanded(true); } }, "Zobrazit cel\u00FD profil")),
            expanded && (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].mentorDetailsContent },
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("p", null, bioText.slice(shortBio.length).trim()),
                challengeText && (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].mentorChallenge },
                    react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("strong", null, "Nejv\u011Bt\u0161\u00ED p\u0159ekonan\u00E1 v\u00FDzva:"),
                    " ",
                    challengeText)),
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("button", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].mentorDetailsToggle, onClick: function () { return setExpanded(false); }, style: { marginTop: '12px' } }, "Sbalit profil"))))),
        react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].mentorCardActions },
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("button", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].btnPrimary, onClick: onRequest, style: { width: '100%' } }, "Po\u017E\u00E1dat o mentoring"))));
};
function getInitials(name) {
    var parts = name.trim().split(/\s+/);
    if (parts.length >= 2)
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
}
/* harmony default export */ __webpack_exports__["e"] = (MentorCatalog);


/***/ }),

/***/ "YFzv":
/*!**************************************************!*\
  !*** ./node_modules/@pnp/sp/utils/file-names.js ***!
  \**************************************************/
/*! exports provided: containsInvalidFileFolderChars, stripInvalidFileFolderChars */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export containsInvalidFileFolderChars */
/* unused harmony export stripInvalidFileFolderChars */
// eslint-disable-next-line no-control-regex
const InvalidFileFolderNameCharsOnlineRegex = /["*:<>?/\\|\x00-\x1f\x7f-\x9f]/g;
// eslint-disable-next-line no-control-regex
const InvalidFileFolderNameCharsOnPremiseRegex = /["#%*:<>?/\\|\x00-\x1f\x7f-\x9f]/g;
/**
 * Checks if file or folder name contains invalid characters
 *
 * @param input File or folder name to check
 * @param onPremise Set to true for SharePoint On-Premise
 * @returns True if contains invalid chars, false otherwise
 */
function containsInvalidFileFolderChars(input, onPremise = false) {
    if (onPremise) {
        return InvalidFileFolderNameCharsOnPremiseRegex.test(input);
    }
    else {
        return InvalidFileFolderNameCharsOnlineRegex.test(input);
    }
}
/**
 * Removes invalid characters from file or folder name
 *
 * @param input File or folder name
 * @param replacer Value that will replace invalid characters
 * @param onPremise Set to true for SharePoint On-Premise
 * @returns File or folder name with replaced invalid characters
 */
function stripInvalidFileFolderChars(input, replacer = "", onPremise = false) {
    if (onPremise) {
        return input.replace(InvalidFileFolderNameCharsOnPremiseRegex, replacer);
    }
    else {
        return input.replace(InvalidFileFolderNameCharsOnlineRegex, replacer);
    }
}
//# sourceMappingURL=file-names.js.map

/***/ }),

/***/ "Ymo3":
/*!**********************************************!*\
  !*** ./node_modules/@pnp/queryable/index.js ***!
  \**********************************************/
/*! exports provided: Queryable, get, post, put, patch, del, op, queryableFactory, invokable, BearerToken, BrowserFetch, BrowserFetchWithRetry, CacheAlways, CacheNever, CacheKey, Caching, bindCachingCore, CachingPessimisticRefresh, asCancelableScope, cancelableScope, Cancelable, CancelAction, InjectHeaders, DebugHeaders, DefaultParse, TextParse, BlobParse, JSONParse, BufferParse, HeaderParse, JSONHeaderParse, errorCheck, parseODataJSON, parseBinderWithErrorCheck, HttpRequestError, Timeout, ResolveOnData, RejectOnError, addProp, body, headers */
/*! exports used: BrowserFetchWithRetry, DefaultParse, InjectHeaders, JSONParse, Queryable, RejectOnError, ResolveOnData, TextParse, addProp, body, del, get, headers, op, parseBinderWithErrorCheck, parseODataJSON, patch, post, queryableFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return addProp; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return body; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return headers; });
/* harmony import */ var _pnp_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @pnp/core */ "JC1J");
/* harmony import */ var _queryable_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./queryable.js */ "Ww49");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "i", function() { return _queryable_js__WEBPACK_IMPORTED_MODULE_1__["e"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "l", function() { return _queryable_js__WEBPACK_IMPORTED_MODULE_1__["t"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "u", function() { return _queryable_js__WEBPACK_IMPORTED_MODULE_1__["n"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "p", function() { return _queryable_js__WEBPACK_IMPORTED_MODULE_1__["a"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "h", function() { return _queryable_js__WEBPACK_IMPORTED_MODULE_1__["i"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "b", function() { return _queryable_js__WEBPACK_IMPORTED_MODULE_1__["r"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "g", function() { return _queryable_js__WEBPACK_IMPORTED_MODULE_1__["o"]; });

/* harmony import */ var _behaviors_bearer_token_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./behaviors/bearer-token.js */ "WE4i");
/* harmony import */ var _behaviors_browser_fetch_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./behaviors/browser-fetch.js */ "do2w");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "e", function() { return _behaviors_browser_fetch_js__WEBPACK_IMPORTED_MODULE_3__["e"]; });

/* harmony import */ var _behaviors_caching_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./behaviors/caching.js */ "VxMn");
/* harmony import */ var _behaviors_caching_pessimistic_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./behaviors/caching-pessimistic.js */ "qL0N");
/* harmony import */ var _behaviors_cancelable_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./behaviors/cancelable.js */ "+y5s");
/* harmony import */ var _behaviors_inject_headers_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./behaviors/inject-headers.js */ "XOGp");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "n", function() { return _behaviors_inject_headers_js__WEBPACK_IMPORTED_MODULE_7__["e"]; });

/* harmony import */ var _behaviors_debug_headers_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./behaviors/debug-headers.js */ "NfnK");
/* harmony import */ var _behaviors_parsers_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./behaviors/parsers.js */ "udT0");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "t", function() { return _behaviors_parsers_js__WEBPACK_IMPORTED_MODULE_9__["e"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "a", function() { return _behaviors_parsers_js__WEBPACK_IMPORTED_MODULE_9__["n"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "s", function() { return _behaviors_parsers_js__WEBPACK_IMPORTED_MODULE_9__["a"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "m", function() { return _behaviors_parsers_js__WEBPACK_IMPORTED_MODULE_9__["i"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "_", function() { return _behaviors_parsers_js__WEBPACK_IMPORTED_MODULE_9__["r"]; });

/* harmony import */ var _behaviors_timeout_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./behaviors/timeout.js */ "ISfK");
/* harmony import */ var _behaviors_resolvers_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./behaviors/resolvers.js */ "tGZ3");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "r", function() { return _behaviors_resolvers_js__WEBPACK_IMPORTED_MODULE_11__["e"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "o", function() { return _behaviors_resolvers_js__WEBPACK_IMPORTED_MODULE_11__["t"]; });



/**
 * Behavior exports
 */










/**
 * Adds a property to a target instance
 *
 * @param target The object to whose prototype we will add a property
 * @param name Property name
 * @param factory Factory method used to produce the property value
 * @param path Any additional path required to produce the value
 */
function addProp(target, name, factory, path) {
    Reflect.defineProperty(target.prototype, name, {
        configurable: true,
        enumerable: true,
        get: function () {
            return factory(this, path || name);
        },
    });
}
/**
 * takes the supplied object of type U, JSON.stringify's it, and sets it as the value of a "body" property
 */
function body(o, previous) {
    return Object.assign({ body: Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* jsS */ "_"])(o) }, previous);
}
/**
 * Adds headers to an new/existing RequestInit
 *
 * @param o Headers to add
 * @param previous Any previous partial RequestInit
 * @returns RequestInit combining previous and specified headers
 */
// eslint-disable-next-line @typescript-eslint/ban-types
function headers(o, previous) {
    return Object.assign({}, previous, { headers: { ...previous === null || previous === void 0 ? void 0 : previous.headers, ...o } });
}
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "Z+AG":
/*!***********************************************************************************************!*\
  !*** ./node_modules/@microsoft/spfx-heft-plugins/node_modules/css-loader/dist/runtime/api.js ***!
  \***********************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (useSourceMap) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item, useSourceMap);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join('');
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === 'string') {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, '']];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

function cssWithMappingToString(item, useSourceMap) {
  var content = item[1] || ''; // eslint-disable-next-line prefer-destructuring

  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (useSourceMap && typeof btoa === 'function') {
    var sourceMapping = toComment(cssMapping);
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || '').concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
  }

  return [content].join('\n');
} // Adapted from convert-source-map (MIT)


function toComment(sourceMap) {
  // eslint-disable-next-line no-undef
  var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
  var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
  return "/*# ".concat(data, " */");
}

/***/ }),

/***/ "a6z2":
/*!*****************************************************************!*\
  !*** ./lib/webparts/auresApp/components/hr/MentorManagement.js ***!
  \*****************************************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "cDcd");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../AuresApp.module.scss */ "sg2l");
/* harmony import */ var _services_MentoringService__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../services/MentoringService */ "39m/");
/* harmony import */ var _utils_mockData__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../utils/mockData */ "IxoJ");
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};




var emptyForm = {
    Title: '', JobTitle: '', Superpower: '', Bio: '', Capacity: 3, PhotoUrl: ''
};
var MentorManagement = function (_a) {
    var sp = _a.sp;
    var _b = react__WEBPACK_IMPORTED_MODULE_0__["useState"]([]), mentors = _b[0], setMentors = _b[1];
    var _c = react__WEBPACK_IMPORTED_MODULE_0__["useState"](true), loading = _c[0], setLoading = _c[1];
    var _d = react__WEBPACK_IMPORTED_MODULE_0__["useState"](false), saving = _d[0], setSaving = _d[1];
    // Add/Edit form
    var _e = react__WEBPACK_IMPORTED_MODULE_0__["useState"](false), showForm = _e[0], setShowForm = _e[1];
    var _f = react__WEBPACK_IMPORTED_MODULE_0__["useState"](null), editingId = _f[0], setEditingId = _f[1];
    var _g = react__WEBPACK_IMPORTED_MODULE_0__["useState"](emptyForm), form = _g[0], setForm = _g[1];
    // Delete confirmation
    var _h = react__WEBPACK_IMPORTED_MODULE_0__["useState"](null), deletingId = _h[0], setDeletingId = _h[1];
    react__WEBPACK_IMPORTED_MODULE_0__["useEffect"](function () {
        new _services_MentoringService__WEBPACK_IMPORTED_MODULE_2__[/* MentoringService */ "e"](sp).getAllMentorsForAdmin()
            .then(setMentors)
            .catch(function () { return setMentors(_utils_mockData__WEBPACK_IMPORTED_MODULE_3__[/* MOCK_MENTORS */ "e"]); })
            .finally(function () { return setLoading(false); });
    }, [sp]);
    var updateField = function (key, value) {
        setForm(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[key] = value, _a)));
        });
    };
    var openAddForm = function () {
        setEditingId(null);
        setForm(emptyForm);
        setShowForm(true);
    };
    var openEditForm = function (mentor) {
        var _a;
        setEditingId(mentor.Id);
        setForm({
            Title: mentor.Title,
            JobTitle: mentor.JobTitle,
            Superpower: mentor.Superpower,
            Bio: mentor.Bio,
            Capacity: mentor.Capacity,
            PhotoUrl: (_a = mentor.PhotoUrl) !== null && _a !== void 0 ? _a : ''
        });
        setShowForm(true);
    };
    var handleSave = function () { return __awaiter(void 0, void 0, void 0, function () {
        var svc, newId_1, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!form.Title.trim())
                        return [2 /*return*/];
                    setSaving(true);
                    svc = new _services_MentoringService__WEBPACK_IMPORTED_MODULE_2__[/* MentoringService */ "e"](sp);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, , 7]);
                    if (!editingId) return [3 /*break*/, 3];
                    return [4 /*yield*/, svc.updateMentor(editingId, {
                            Title: form.Title.trim(),
                            JobTitle: form.JobTitle.trim(),
                            Superpower: form.Superpower.trim(),
                            Bio: form.Bio.trim(),
                            Capacity: form.Capacity,
                            PhotoUrl: form.PhotoUrl.trim()
                        })];
                case 2:
                    _b.sent();
                    setMentors(function (prev) { return prev.map(function (m) { return m.Id === editingId ? __assign(__assign({}, m), { Title: form.Title.trim(), JobTitle: form.JobTitle.trim(), Superpower: form.Superpower.trim(), Bio: form.Bio.trim(), Capacity: form.Capacity, PhotoUrl: form.PhotoUrl.trim() }) : m; }); });
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, svc.addMentor({
                        Title: form.Title.trim(),
                        MentorUserId: 0,
                        JobTitle: form.JobTitle.trim(),
                        Superpower: form.Superpower.trim(),
                        Bio: form.Bio.trim(),
                        Capacity: form.Capacity,
                        PhotoUrl: form.PhotoUrl.trim()
                    })];
                case 4:
                    newId_1 = _b.sent();
                    setMentors(function (prev) { return __spreadArray(__spreadArray([], prev, true), [{
                            Id: newId_1 !== null && newId_1 !== void 0 ? newId_1 : prev.length + 100,
                            Title: form.Title.trim(),
                            MentorUser: { Id: 0, Title: form.Title.trim(), EMail: '' },
                            JobTitle: form.JobTitle.trim(),
                            Superpower: form.Superpower.trim(),
                            Bio: form.Bio.trim(),
                            Capacity: form.Capacity,
                            AvailabilityNote: '',
                            PhotoUrl: form.PhotoUrl.trim(),
                            IsActive: true
                        }], false); });
                    _b.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    _a = _b.sent();
                    return [3 /*break*/, 7];
                case 7:
                    setSaving(false);
                    setShowForm(false);
                    setEditingId(null);
                    return [2 /*return*/];
            }
        });
    }); };
    var handleDelete = function (mentorId) { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setSaving(true);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, new _services_MentoringService__WEBPACK_IMPORTED_MODULE_2__[/* MentoringService */ "e"](sp).deleteMentor(mentorId)];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = _b.sent();
                    return [3 /*break*/, 4];
                case 4:
                    setMentors(function (prev) { return prev.filter(function (m) { return m.Id !== mentorId; }); });
                    setDeletingId(null);
                    setSaving(false);
                    return [2 /*return*/];
            }
        });
    }); };
    var toggleActive = function (mentor) { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, new _services_MentoringService__WEBPACK_IMPORTED_MODULE_2__[/* MentoringService */ "e"](sp).setMentorActive(mentor.Id, !mentor.IsActive)];
                case 1:
                    _b.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = _b.sent();
                    return [3 /*break*/, 3];
                case 3:
                    setMentors(function (prev) { return prev.map(function (m) { return m.Id === mentor.Id ? __assign(__assign({}, m), { IsActive: !m.IsActive }) : m; }); });
                    return [2 /*return*/];
            }
        });
    }); };
    if (loading)
        return react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].loading }, "Na\u010D\u00EDt\u00E1m mentory\u2026");
    return (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", null,
        react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].pageHeader },
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("h2", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].pageTitle },
                "Spr\u00E1va mentor\u016F (",
                mentors.length,
                ")"),
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("button", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].btnPrimary, onClick: openAddForm }, "+ P\u0159idat mentora")),
        showForm && (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].mentorFormCard },
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("h3", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].formSectionTitle }, editingId ? 'Upravit mentora' : 'Nový mentor'),
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].mentorFormGrid },
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].mentorFormField },
                    react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("label", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].messageLabel }, "Jm\u00E9no a p\u0159\u00EDjmen\u00ED"),
                    react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("input", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].formInput, value: form.Title, onChange: function (e) { return updateField('Title', e.target.value); }, placeholder: "Jan Nov\u00E1k" })),
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].mentorFormField },
                    react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("label", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].messageLabel }, "Pozice"),
                    react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("input", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].formInput, value: form.JobTitle, onChange: function (e) { return updateField('JobTitle', e.target.value); }, placeholder: "CEO, CFO, VP Marketing\u2026" })),
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].mentorFormField },
                    react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("label", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].messageLabel }, "Superschopnost"),
                    react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("input", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].formInput, value: form.Superpower, onChange: function (e) { return updateField('Superpower', e.target.value); }, placeholder: "Strategick\u00E9 my\u0161len\u00ED, leadership\u2026" })),
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].mentorFormField },
                    react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("label", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].messageLabel }, "Kapacita (po\u010Det talent\u016F)"),
                    react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("input", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].formInput, type: "number", min: 0, max: 20, value: form.Capacity, onChange: function (e) { return updateField('Capacity', Number(e.target.value)); } })),
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].mentorFormFieldFull },
                    react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("label", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].messageLabel }, "Bio"),
                    react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("textarea", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].messageTextarea, value: form.Bio, onChange: function (e) { return updateField('Bio', e.target.value); }, placeholder: "Kr\u00E1tk\u00FD popis mentora\u2026", rows: 3 })),
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].mentorFormFieldFull },
                    react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("label", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].messageLabel }, "URL fotky"),
                    react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("input", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].formInput, value: form.PhotoUrl, onChange: function (e) { return updateField('PhotoUrl', e.target.value); }, placeholder: "https://\u2026 (odkaz na fotografii v SharePointu)" }))),
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].formActions },
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("button", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].btnPrimary, disabled: saving || !form.Title.trim(), onClick: function () { void handleSave(); } }, saving ? 'Ukládám…' : (editingId ? 'Uložit změny' : 'Vytvořit mentora')),
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("button", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].btnSecondary, onClick: function () { setShowForm(false); setEditingId(null); } }, "Zru\u0161it")))),
        react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].managementList }, mentors.map(function (mentor) { return (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { key: mentor.Id, className: [_AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].managementRow, !mentor.IsActive ? _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].managementRowInactive : ''].filter(Boolean).join(' ') },
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].managementInfo },
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("p", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].managementName }, mentor.Title),
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("p", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].managementMeta },
                    mentor.JobTitle,
                    " \u00B7 ",
                    mentor.Superpower)),
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("span", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].managementCapacityLabel },
                "Kapacita: ",
                mentor.Capacity),
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("button", { className: mentor.IsActive ? _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].activeBtn : _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].inactiveBtn, onClick: function () { void toggleActive(mentor); } }, mentor.IsActive ? 'Aktivní' : 'Neaktivní'),
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("button", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].hrActionBtn, onClick: function () { return openEditForm(mentor); }, title: "Upravit" }, "Upravit"),
            deletingId === mentor.Id ? (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].deleteConfirm },
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("span", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].deleteConfirmText }, "Smazat?"),
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("button", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].hrActionBtnDanger, disabled: saving, onClick: function () { void handleDelete(mentor.Id); } }, "Ano"),
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("button", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].hrActionBtn, onClick: function () { return setDeletingId(null); } }, "Ne"))) : (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("button", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].hrActionBtnDanger, onClick: function () { return setDeletingId(mentor.Id); }, title: "Smazat mentora" }, "Smazat")))); }))));
};
/* harmony default export */ __webpack_exports__["e"] = (MentorManagement);


/***/ }),

/***/ "br4S":
/*!*********************************************!*\
  !*** external "@microsoft/sp-webpart-base" ***!
  \*********************************************/
/*! no static exports found */
/*! exports used: BaseClientSideWebPart */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_br4S__;

/***/ }),

/***/ "cDcd":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/*! no static exports found */
/*! exports used: createElement, useCallback, useEffect, useState */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_cDcd__;

/***/ }),

/***/ "dVsc":
/*!********************************************!*\
  !*** ./node_modules/@pnp/sp/webs/types.js ***!
  \********************************************/
/*! exports provided: _Webs, Webs, _Web, Web */
/*! exports used: Web, _Web */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export _Webs */
/* unused harmony export Webs */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "t", function() { return _Web; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return Web; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "LVfT");
/* harmony import */ var _pnp_queryable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @pnp/queryable */ "Ymo3");
/* harmony import */ var _spqueryable_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../spqueryable.js */ "F4qD");
/* harmony import */ var _decorators_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../decorators.js */ "hMpi");
/* harmony import */ var _utils_extract_web_url_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/extract-web-url.js */ "OXUt");
/* harmony import */ var _pnp_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @pnp/core */ "JC1J");
/* harmony import */ var _utils_encode_path_str_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/encode-path-str.js */ "vbtm");







let _Webs = class _Webs extends _spqueryable_js__WEBPACK_IMPORTED_MODULE_2__[/* _SPCollection */ "a"] {
    /**
     * Adds a new web to the collection
     *
     * @param title The new web's title
     * @param url The new web's relative url
     * @param description The new web's description
     * @param template The new web's template internal name (default = STS)
     * @param language The locale id that specifies the new web's language (default = 1033 [English, US])
     * @param inheritPermissions When true, permissions will be inherited from the new web's parent (default = true)
     */
    async add(Title, Url, Description = "", WebTemplate = "STS", Language = 1033, UseSamePermissionsAsParentSite = true) {
        const postBody = Object(_pnp_queryable__WEBPACK_IMPORTED_MODULE_1__[/* body */ "d"])({
            "parameters": {
                Description,
                Language,
                Title,
                Url,
                UseSamePermissionsAsParentSite,
                WebTemplate,
            },
        });
        return Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_2__[/* spPost */ "d"])(Webs(this, "add"), postBody);
    }
};
_Webs = Object(tslib__WEBPACK_IMPORTED_MODULE_0__[/* __decorate */ "e"])([
    Object(_decorators_js__WEBPACK_IMPORTED_MODULE_3__[/* defaultPath */ "e"])("webs")
], _Webs);

const Webs = Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_2__[/* spInvokableFactory */ "c"])(_Webs);
/**
 * Ensures the url passed to the constructor is correctly rebased to a web url
 *
 * @param candidate The candidate web url
 * @param path The caller supplied path, which may contain _api, meaning we don't append _api/web
 */
function rebaseWebUrl(candidate, path) {
    let replace = "_api/web";
    // this allows us to both:
    // - test if `candidate` already has an api path
    // - ensure that we append the correct one as sometimes a web is not defined
    //   by _api/web, in the case of _api/site/rootweb for example
    const matches = /(_api[/|\\](site\/rootweb|site|web))/i.exec(candidate);
    if ((matches === null || matches === void 0 ? void 0 : matches.length) > 0) {
        // we want just the base url part (before the _api)
        candidate = Object(_utils_extract_web_url_js__WEBPACK_IMPORTED_MODULE_4__[/* extractWebUrl */ "e"])(candidate);
        // we want to ensure we put back the correct string
        replace = matches[1];
    }
    // we only need to append the _api part IF `path` doesn't already include it.
    if ((path === null || path === void 0 ? void 0 : path.indexOf("_api")) < 0) {
        candidate = Object(_pnp_core__WEBPACK_IMPORTED_MODULE_5__[/* combine */ "o"])(candidate, replace);
    }
    return candidate;
}
/**
 * Describes a web
 *
 */
let _Web = class _Web extends _spqueryable_js__WEBPACK_IMPORTED_MODULE_2__[/* _SPInstance */ "i"] {
    constructor(base, path) {
        if (typeof base === "string") {
            base = rebaseWebUrl(base, path);
        }
        else if (Object(_pnp_core__WEBPACK_IMPORTED_MODULE_5__[/* isArray */ "f"])(base)) {
            base = [base[0], rebaseWebUrl(base[1], path)];
        }
        else {
            base = [base, rebaseWebUrl(base.toUrl(), path)];
        }
        super(base, path);
        this.delete = Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_2__[/* deleteable */ "o"])();
    }
    /**
     * Gets this web's subwebs
     *
     */
    get webs() {
        return Webs(this);
    }
    /**
     * Allows access to the web's all properties collection
     */
    get allProperties() {
        return Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_2__[/* SPInstance */ "t"])(this, "allproperties");
    }
    /**
     * Gets a collection of WebInfos for this web's subwebs
     *
     */
    get webinfos() {
        return Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_2__[/* SPCollection */ "e"])(this, "webinfos");
    }
    /**
     * Gets this web's parent web and data
     *
     */
    async getParentWeb() {
        const { Url, ParentWeb } = await this.select("Url", "ParentWeb/ServerRelativeUrl").expand("ParentWeb")();
        if (ParentWeb === null || ParentWeb === void 0 ? void 0 : ParentWeb.ServerRelativeUrl) {
            return Web([this, Object(_pnp_core__WEBPACK_IMPORTED_MODULE_5__[/* combine */ "o"])((new URL(Url)).origin, ParentWeb.ServerRelativeUrl)]);
        }
        return null;
    }
    /**
     * Updates this web instance with the supplied properties
     *
     * @param properties A plain object hash of values to update for the web
     */
    async update(properties) {
        return Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_2__[/* spPostMerge */ "l"])(this, Object(_pnp_queryable__WEBPACK_IMPORTED_MODULE_1__[/* body */ "d"])(properties));
    }
    /**
     * Applies the theme specified by the contents of each of the files specified in the arguments to the site
     *
     * @param colorPaletteUrl The server-relative URL of the color palette file
     * @param fontSchemeUrl The server-relative URL of the font scheme
     * @param backgroundImageUrl The server-relative URL of the background image
     * @param shareGenerated When true, the generated theme files are stored in the root site. When false, they are stored in this web
     */
    applyTheme(colorPaletteUrl, fontSchemeUrl, backgroundImageUrl, shareGenerated) {
        const postBody = Object(_pnp_queryable__WEBPACK_IMPORTED_MODULE_1__[/* body */ "d"])({
            backgroundImageUrl,
            colorPaletteUrl,
            fontSchemeUrl,
            shareGenerated,
        });
        return Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_2__[/* spPost */ "d"])(Web(this, "applytheme"), postBody);
    }
    /**
     * Applies the specified site definition or site template to the Web site that has no template applied to it
     *
     * @param template Name of the site definition or the name of the site template
     */
    applyWebTemplate(template) {
        return Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_2__[/* spPost */ "d"])(Web(this, `applywebtemplate(webTemplate='${Object(_utils_encode_path_str_js__WEBPACK_IMPORTED_MODULE_6__[/* encodePath */ "e"])(template)}')`));
    }
    /**
     * Returns the collection of changes from the change log that have occurred within the list, based on the specified query
     *
     * @param query The change query
     */
    getChanges(query) {
        return Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_2__[/* spPost */ "d"])(Web(this, "getchanges"), Object(_pnp_queryable__WEBPACK_IMPORTED_MODULE_1__[/* body */ "d"])({ query }));
    }
    /**
     * Returns the name of the image file for the icon that is used to represent the specified file
     *
     * @param filename The file name. If this parameter is empty, the server returns an empty string
     * @param size The size of the icon: 16x16 pixels = 0, 32x32 pixels = 1 (default = 0)
     * @param progId The ProgID of the application that was used to create the file, in the form OLEServerName.ObjectName
     */
    mapToIcon(filename, size = 0, progId = "") {
        return Web(this, `maptoicon(filename='${Object(_utils_encode_path_str_js__WEBPACK_IMPORTED_MODULE_6__[/* encodePath */ "e"])(filename)}',progid='${Object(_utils_encode_path_str_js__WEBPACK_IMPORTED_MODULE_6__[/* encodePath */ "e"])(progId)}',size=${size})`)();
    }
    /**
     * Returns the tenant property corresponding to the specified key in the app catalog site
     *
     * @param key Id of storage entity to be set
     */
    getStorageEntity(key) {
        return Web(this, `getStorageEntity('${Object(_utils_encode_path_str_js__WEBPACK_IMPORTED_MODULE_6__[/* encodePath */ "e"])(key)}')`)();
    }
    /**
     * This will set the storage entity identified by the given key (MUST be called in the context of the app catalog)
     *
     * @param key Id of storage entity to be set
     * @param value Value of storage entity to be set
     * @param description Description of storage entity to be set
     * @param comments Comments of storage entity to be set
     */
    setStorageEntity(key, value, description = "", comments = "") {
        return Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_2__[/* spPost */ "d"])(Web(this, "setStorageEntity"), Object(_pnp_queryable__WEBPACK_IMPORTED_MODULE_1__[/* body */ "d"])({
            comments,
            description,
            key,
            value,
        }));
    }
    /**
     * This will remove the storage entity identified by the given key
     *
     * @param key Id of storage entity to be removed
     */
    removeStorageEntity(key) {
        return Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_2__[/* spPost */ "d"])(Web(this, `removeStorageEntity('${Object(_utils_encode_path_str_js__WEBPACK_IMPORTED_MODULE_6__[/* encodePath */ "e"])(key)}')`));
    }
    /**
    * Returns a collection of objects that contain metadata about subsites of the current site in which the current user is a member.
    *
    * @param nWebTemplateFilter Specifies the site definition (default = -1)
    * @param nConfigurationFilter A 16-bit integer that specifies the identifier of a configuration (default = -1)
    */
    getSubwebsFilteredForCurrentUser(nWebTemplateFilter = -1, nConfigurationFilter = -1) {
        return Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_2__[/* SPCollection */ "e"])(this, `getSubwebsFilteredForCurrentUser(nWebTemplateFilter=${nWebTemplateFilter},nConfigurationFilter=${nConfigurationFilter})`);
    }
    /**
     * Returns a collection of site templates available for the site
     *
     * @param language The locale id of the site templates to retrieve (default = 1033 [English, US])
     * @param includeCrossLanguage When true, includes language-neutral site templates; otherwise false (default = true)
     */
    availableWebTemplates(language = 1033, includeCrossLanugage = true) {
        return Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_2__[/* SPCollection */ "e"])(this, `getavailablewebtemplates(lcid=${language},doincludecrosslanguage=${includeCrossLanugage})`);
    }
};
_Web = Object(tslib__WEBPACK_IMPORTED_MODULE_0__[/* __decorate */ "e"])([
    Object(_decorators_js__WEBPACK_IMPORTED_MODULE_3__[/* defaultPath */ "e"])("_api/web")
], _Web);

const Web = Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_2__[/* spInvokableFactory */ "c"])(_Web);
//# sourceMappingURL=types.js.map

/***/ }),

/***/ "do2w":
/*!****************************************************************!*\
  !*** ./node_modules/@pnp/queryable/behaviors/browser-fetch.js ***!
  \****************************************************************/
/*! exports provided: BrowserFetch, BrowserFetchWithRetry */
/*! exports used: BrowserFetchWithRetry */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export BrowserFetch */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return BrowserFetchWithRetry; });
/* harmony import */ var _pnp_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @pnp/core */ "JC1J");
/* harmony import */ var _parsers_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./parsers.js */ "udT0");


function BrowserFetch(props) {
    const { replace } = {
        replace: true,
        ...props,
    };
    return (instance) => {
        if (replace) {
            instance.on.send.clear();
        }
        instance.on.send(function (url, init) {
            this.log(`Fetch: ${init.method} ${url.toString()}`, 0);
            return fetch(url.toString(), init);
        });
        return instance;
    };
}
function BrowserFetchWithRetry(props) {
    const { interval, replace, retries } = {
        replace: true,
        interval: 200,
        retries: 3,
        ...props,
    };
    return (instance) => {
        if (replace) {
            instance.on.send.clear();
        }
        instance.on.send(function (url, init) {
            let response;
            let wait = interval;
            let count = 0;
            let lastErr;
            const retry = async () => {
                // if we've tried too many times, throw
                if (count >= retries) {
                    throw lastErr || new _parsers_js__WEBPACK_IMPORTED_MODULE_1__[/* HttpRequestError */ "t"](`Retry count exceeded (${retries}) for this request. ${response.status}: ${response.statusText};`, response);
                }
                count++;
                if (typeof response === "undefined" || (response === null || response === void 0 ? void 0 : response.status) === 429 || (response === null || response === void 0 ? void 0 : response.status) === 503 || (response === null || response === void 0 ? void 0 : response.status) === 504) {
                    // this is our first try and response isn't defined yet
                    // we have been throttled OR http status code 503 or 504, we can retry this
                    if (typeof response !== "undefined") {
                        // this isn't our first try so we need to calculate delay
                        if (response.headers.has("Retry-After")) {
                            // if we have gotten a header, use that value as the delay value in seconds
                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                            wait = parseInt(response.headers.get("Retry-After"), 10) * 1000;
                        }
                        else {
                            // Increment our counters.
                            wait *= 2;
                        }
                        this.log(`Attempt #${count} to retry request which failed with ${response.status}: ${response.statusText}`, 0);
                        await Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* delay */ "c"])(wait);
                    }
                    try {
                        const u = url.toString();
                        this.log(`Fetch: ${init.method} ${u}`, 0);
                        response = await fetch(u, init);
                        // if we got a good response, return it, otherwise see if we can retry
                        return response.ok ? response : retry();
                    }
                    catch (err) {
                        if (/AbortError/.test(err.name)) {
                            // don't retry aborted requests
                            throw err;
                        }
                        // if there is no network the response is undefined and err is all we have
                        // so we grab the err and save it to throw if we exceed the number of retries
                        // #2226 first reported this
                        lastErr = err;
                        return retry();
                    }
                }
                else {
                    return response;
                }
            };
            // this the the first call to retry that starts the cycle
            // response is undefined and the other values have their defaults
            return retry();
        });
        return instance;
    };
}
//# sourceMappingURL=browser-fetch.js.map

/***/ }),

/***/ "faye":
/*!****************************!*\
  !*** external "react-dom" ***!
  \****************************/
/*! no static exports found */
/*! exports used: render, unmountComponentAtNode */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_faye__;

/***/ }),

/***/ "gATm":
/*!**************************************************!*\
  !*** ./lib/webparts/auresApp/AuresAppWebPart.js ***!
  \**************************************************/
/*! exports provided: default */
/*! all exports used */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "cDcd");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "faye");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _microsoft_sp_core_library__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @microsoft/sp-core-library */ "UWqr");
/* harmony import */ var _microsoft_sp_core_library__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_microsoft_sp_core_library__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @microsoft/sp-property-pane */ "26ea");
/* harmony import */ var _microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _microsoft_sp_webpart_base__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @microsoft/sp-webpart-base */ "br4S");
/* harmony import */ var _microsoft_sp_webpart_base__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_microsoft_sp_webpart_base__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _pnp_sp__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @pnp/sp */ "UKGb");
/* harmony import */ var _pnp_sp_behaviors_spfx__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @pnp/sp/behaviors/spfx */ "OWTB");
/* harmony import */ var AuresAppWebPartStrings__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! AuresAppWebPartStrings */ "DnXt");
/* harmony import */ var AuresAppWebPartStrings__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(AuresAppWebPartStrings__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _components_AuresApp__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/AuresApp */ "S1sg");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};









var AuresAppWebPart = /** @class */ (function (_super) {
    __extends(AuresAppWebPart, _super);
    function AuresAppWebPart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AuresAppWebPart.prototype.onInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this._sp = Object(_pnp_sp__WEBPACK_IMPORTED_MODULE_5__[/* spfi */ "t"])().using(Object(_pnp_sp_behaviors_spfx__WEBPACK_IMPORTED_MODULE_6__[/* SPFx */ "e"])(this.context));
                return [2 /*return*/];
            });
        });
    };
    AuresAppWebPart.prototype.render = function () {
        var _a;
        var element = react__WEBPACK_IMPORTED_MODULE_0__["createElement"](_components_AuresApp__WEBPACK_IMPORTED_MODULE_8__[/* default */ "e"], {
            sp: this._sp,
            context: this.context,
            hrEmail: (_a = this.properties.hrEmail) !== null && _a !== void 0 ? _a : ''
        });
        react_dom__WEBPACK_IMPORTED_MODULE_1__["render"](element, this.domElement);
    };
    AuresAppWebPart.prototype.onDispose = function () {
        react_dom__WEBPACK_IMPORTED_MODULE_1__["unmountComponentAtNode"](this.domElement);
    };
    Object.defineProperty(AuresAppWebPart.prototype, "dataVersion", {
        get: function () {
            return _microsoft_sp_core_library__WEBPACK_IMPORTED_MODULE_2__["Version"].parse('1.0');
        },
        enumerable: false,
        configurable: true
    });
    AuresAppWebPart.prototype.getPropertyPaneConfiguration = function () {
        return {
            pages: [
                {
                    header: {
                        description: AuresAppWebPartStrings__WEBPACK_IMPORTED_MODULE_7__["PropertyPaneDescription"]
                    },
                    groups: [
                        {
                            groupName: AuresAppWebPartStrings__WEBPACK_IMPORTED_MODULE_7__["BasicGroupName"],
                            groupFields: [
                                Object(_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_3__["PropertyPaneTextField"])('description', {
                                    label: AuresAppWebPartStrings__WEBPACK_IMPORTED_MODULE_7__["DescriptionFieldLabel"]
                                }),
                                Object(_microsoft_sp_property_pane__WEBPACK_IMPORTED_MODULE_3__["PropertyPaneTextField"])('hrEmail', {
                                    label: 'HR Email (prijemce notifikaci)'
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return AuresAppWebPart;
}(_microsoft_sp_webpart_base__WEBPACK_IMPORTED_MODULE_4__["BaseClientSideWebPart"]));
/* harmony default export */ __webpack_exports__["default"] = (AuresAppWebPart);


/***/ }),

/***/ "hMpi":
/*!********************************************!*\
  !*** ./node_modules/@pnp/sp/decorators.js ***!
  \********************************************/
/*! exports provided: defaultPath */
/*! exports used: defaultPath */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return defaultPath; });
/**
 * Decorator used to specify the default path for SPQueryable objects
 *
 * @param path
 */
function defaultPath(path) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (target) {
        return class extends target {
            constructor(...args) {
                super(args[0], args.length > 1 && args[1] !== undefined ? args[1] : path);
            }
        };
    };
}
//# sourceMappingURL=decorators.js.map

/***/ }),

/***/ "hTrG":
/*!******************************************************!*\
  !*** ./node_modules/@pnp/sp/utils/odata-url-from.js ***!
  \******************************************************/
/*! exports provided: odataUrlFrom */
/*! exports used: odataUrlFrom */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return odataUrlFrom; });
/* harmony import */ var _pnp_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @pnp/core */ "JC1J");
/* harmony import */ var _extract_web_url_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./extract-web-url.js */ "OXUt");


function odataUrlFrom(candidate) {
    const parts = [];
    const s = ["odata.type", "odata.editLink", "__metadata", "odata.metadata", "odata.id"];
    if (Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* hOP */ "u"])(candidate, s[0]) && candidate[s[0]] === "SP.Web") {
        // webs return an absolute url in the id
        if (Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* hOP */ "u"])(candidate, s[4])) {
            parts.push(candidate[s[4]]);
        }
        else if (Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* hOP */ "u"])(candidate, s[2])) {
            // we are dealing with verbose, which has an absolute uri
            parts.push(candidate.__metadata.uri);
        }
    }
    else {
        if (Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* hOP */ "u"])(candidate, s[3]) && Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* hOP */ "u"])(candidate, s[1])) {
            // we are dealign with minimal metadata (default)
            // some entities return an abosolute url in the editlink while for others it is relative
            // without the _api. This code is meant to handle both situations
            const editLink = Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* isUrlAbsolute */ "m"])(candidate[s[1]]) ? candidate[s[1]].split("_api")[1] : candidate[s[1]];
            parts.push(Object(_extract_web_url_js__WEBPACK_IMPORTED_MODULE_1__[/* extractWebUrl */ "e"])(candidate[s[3]]), "_api", editLink);
        }
        else if (Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* hOP */ "u"])(candidate, s[1])) {
            parts.push("_api", candidate[s[1]]);
        }
        else if (Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* hOP */ "u"])(candidate, s[2])) {
            // we are dealing with verbose, which has an absolute uri
            parts.push(candidate.__metadata.uri);
        }
    }
    if (parts.length < 1) {
        return "";
    }
    return Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* combine */ "o"])(...parts);
}
//# sourceMappingURL=odata-url-from.js.map

/***/ }),

/***/ "hy0S":
/*!*********************************************!*\
  !*** ./node_modules/@pnp/sp/lists/types.js ***!
  \*********************************************/
/*! exports provided: _Lists, Lists, _List, List, RenderListDataOptions, ControlMode */
/*! exports used: List, Lists, _List */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export _Lists */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "t", function() { return Lists; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return _List; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return List; });
/* unused harmony export RenderListDataOptions */
/* unused harmony export ControlMode */
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "LVfT");
/* harmony import */ var _pnp_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @pnp/core */ "JC1J");
/* harmony import */ var _pnp_queryable__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @pnp/queryable */ "Ymo3");
/* harmony import */ var _spqueryable_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../spqueryable.js */ "F4qD");
/* harmony import */ var _utils_odata_url_from_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/odata-url-from.js */ "hTrG");
/* harmony import */ var _decorators_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../decorators.js */ "hMpi");
/* harmony import */ var _utils_to_resource_path_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/to-resource-path.js */ "G6u6");
/* harmony import */ var _utils_encode_path_str_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/encode-path-str.js */ "vbtm");








let _Lists = class _Lists extends _spqueryable_js__WEBPACK_IMPORTED_MODULE_3__[/* _SPCollection */ "a"] {
    /**
     * Gets a list from the collection by guid id
     *
     * @param id The Id of the list (GUID)
     */
    getById(id) {
        return List(this).concat(`('${id}')`);
    }
    /**
     * Gets a list from the collection by title
     *
     * @param title The title of the list
     */
    getByTitle(title) {
        return List(this, `getByTitle('${Object(_utils_encode_path_str_js__WEBPACK_IMPORTED_MODULE_7__[/* encodePath */ "e"])(title)}')`);
    }
    /**
     * Adds a new list to the collection
     *
     * @param title The new list's title
     * @param description The new list's description
     * @param template The list template value
     * @param enableContentTypes If true content types will be allowed and enabled, otherwise they will be disallowed and not enabled
     * @param additionalSettings Will be passed as part of the list creation body
     */
    async add(title, desc = "", template = 100, enableContentTypes = false, additionalSettings = {}) {
        const addSettings = {
            "AllowContentTypes": enableContentTypes,
            "BaseTemplate": template,
            "ContentTypesEnabled": enableContentTypes,
            "Description": desc,
            "Title": title,
            ...additionalSettings,
        };
        return Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_3__[/* spPost */ "d"])(this, Object(_pnp_queryable__WEBPACK_IMPORTED_MODULE_2__[/* body */ "d"])(addSettings));
    }
    /**
     * Ensures that the specified list exists in the collection (note: this method not supported for batching)
     *
     * @param title The new list's title
     * @param desc The new list's description
     * @param template The list template value
     * @param enableContentTypes If true content types will be allowed and enabled, otherwise they will be disallowed and not enabled
     * @param additionalSettings Will be passed as part of the list creation body or used to update an existing list
     */
    async ensure(title, desc = "", template = 100, enableContentTypes = false, additionalSettings = {}) {
        const addOrUpdateSettings = { Title: title, Description: desc, ContentTypesEnabled: enableContentTypes, ...additionalSettings };
        const list = this.getByTitle(addOrUpdateSettings.Title);
        try {
            await list.select("Title")();
            const data = await list.update(addOrUpdateSettings);
            return { created: false, data, list: this.getByTitle(addOrUpdateSettings.Title) };
        }
        catch (e) {
            const data = await this.add(title, desc, template, enableContentTypes, addOrUpdateSettings);
            return { created: true, data, list: this.getByTitle(addOrUpdateSettings.Title) };
        }
    }
    /**
     * Gets a list that is the default asset location for images or other files, which the users upload to their wiki pages.
     */
    async ensureSiteAssetsLibrary() {
        const json = await Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_3__[/* spPost */ "d"])(Lists(this, "ensuresiteassetslibrary"));
        return List([this, Object(_utils_odata_url_from_js__WEBPACK_IMPORTED_MODULE_4__[/* odataUrlFrom */ "e"])(json)]);
    }
    /**
     * Gets a list that is the default location for wiki pages.
     */
    async ensureSitePagesLibrary() {
        const json = await Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_3__[/* spPost */ "d"])(Lists(this, "ensuresitepageslibrary"));
        return List([this, Object(_utils_odata_url_from_js__WEBPACK_IMPORTED_MODULE_4__[/* odataUrlFrom */ "e"])(json)]);
    }
};
_Lists = Object(tslib__WEBPACK_IMPORTED_MODULE_0__[/* __decorate */ "e"])([
    Object(_decorators_js__WEBPACK_IMPORTED_MODULE_5__[/* defaultPath */ "e"])("lists")
], _Lists);

const Lists = Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_3__[/* spInvokableFactory */ "c"])(_Lists);
class _List extends _spqueryable_js__WEBPACK_IMPORTED_MODULE_3__[/* _SPInstance */ "i"] {
    constructor() {
        super(...arguments);
        this.delete = Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_3__[/* deleteableWithETag */ "s"])();
    }
    /**
     * Gets the effective base permissions of this list
     *
     */
    get effectiveBasePermissions() {
        return Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_3__[/* SPQueryable */ "n"])(this, "EffectiveBasePermissions");
    }
    /**
     * Gets the event receivers attached to this list
     *
     */
    get eventReceivers() {
        return Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_3__[/* SPCollection */ "e"])(this, "EventReceivers");
    }
    /**
     * Gets the related fields of this list
     *
     */
    get relatedFields() {
        return Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_3__[/* SPQueryable */ "n"])(this, "getRelatedFields");
    }
    /**
     * Gets the IRM settings for this list
     *
     */
    get informationRightsManagementSettings() {
        return Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_3__[/* SPQueryable */ "n"])(this, "InformationRightsManagementSettings");
    }
    /**
     * Updates this list intance with the supplied properties
     *
     * @param properties A plain object hash of values to update for the list
     * @param eTag Value used in the IF-Match header, by default "*"
     */
    async update(properties, eTag = "*") {
        const data = await Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_3__[/* spPostMerge */ "l"])(this, Object(_pnp_queryable__WEBPACK_IMPORTED_MODULE_2__[/* body */ "d"])(properties, Object(_pnp_queryable__WEBPACK_IMPORTED_MODULE_2__[/* headers */ "f"])({ "IF-Match": eTag })));
        return data;
    }
    /**
     * Returns the collection of changes from the change log that have occurred within the list, based on the specified query.
     * @param query A query that is performed against the change log.
     */
    getChanges(query) {
        return Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_3__[/* spPost */ "d"])(List(this, "getchanges"), Object(_pnp_queryable__WEBPACK_IMPORTED_MODULE_2__[/* body */ "d"])({ query }));
    }
    /**
     * Returns the collection of items in the list based on the provided CamlQuery
     * @param query A query that is performed against the list
     * @param expands An expanded array of n items that contains fields to expand in the CamlQuery
     */
    getItemsByCAMLQuery(query, ...expands) {
        return Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_3__[/* spPost */ "d"])(List(this, "getitems").expand(...expands), Object(_pnp_queryable__WEBPACK_IMPORTED_MODULE_2__[/* body */ "d"])({ query }));
    }
    /**
     * See: https://msdn.microsoft.com/en-us/library/office/dn292554.aspx
     * @param query An object that defines the change log item query
     */
    getListItemChangesSinceToken(query) {
        return Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_3__[/* spPost */ "d"])(List(this, "getlistitemchangessincetoken").using(Object(_pnp_queryable__WEBPACK_IMPORTED_MODULE_2__[/* TextParse */ "s"])()), Object(_pnp_queryable__WEBPACK_IMPORTED_MODULE_2__[/* body */ "d"])({ query }));
    }
    /**
     * Moves the list to the Recycle Bin and returns the identifier of the new Recycle Bin item.
     */
    async recycle() {
        return Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_3__[/* spPost */ "d"])(List(this, "recycle"));
    }
    /**
     * Renders list data based on the view xml provided
     * @param viewXml A string object representing a view xml
     */
    async renderListData(viewXml) {
        const q = List(this, "renderlistdata(@viewXml)");
        q.query.set("@viewXml", `'${viewXml}'`);
        const data = await Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_3__[/* spPost */ "d"])(q);
        return JSON.parse(data);
    }
    /**
     * Returns the data for the specified query view
     *
     * @param parameters The parameters to be used to render list data as JSON string.
     * @param overrideParams The parameters that are used to override and extend the regular SPRenderListDataParameters.
     * @param query Allows setting of query parameters
     */
    // eslint-disable-next-line max-len
    renderListDataAsStream(parameters, overrideParameters = null, query = new Map()) {
        if (Object(_pnp_core__WEBPACK_IMPORTED_MODULE_1__[/* hOP */ "u"])(parameters, "RenderOptions") && Object(_pnp_core__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "f"])(parameters.RenderOptions)) {
            parameters.RenderOptions = parameters.RenderOptions.reduce((v, c) => v + c);
        }
        const clone = List(this, "RenderListDataAsStream");
        if (query && query.size > 0) {
            query.forEach((v, k) => clone.query.set(k, v));
        }
        const params = Object(_pnp_core__WEBPACK_IMPORTED_MODULE_1__[/* objectDefinedNotNull */ "g"])(overrideParameters) ? { parameters, overrideParameters } : { parameters };
        return Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_3__[/* spPost */ "d"])(clone, Object(_pnp_queryable__WEBPACK_IMPORTED_MODULE_2__[/* body */ "d"])(params));
    }
    /**
     * Gets the field values and field schema attributes for a list item.
     * @param itemId Item id of the item to render form data for
     * @param formId The id of the form
     * @param mode Enum representing the control mode of the form (Display, Edit, New)
     */
    async renderListFormData(itemId, formId, mode) {
        const data = await Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_3__[/* spPost */ "d"])(List(this, `renderlistformdata(itemid=${itemId}, formid='${formId}', mode='${mode}')`));
        // data will be a string, so we parse it again
        return JSON.parse(data);
    }
    /**
     * Reserves a list item ID for idempotent list item creation.
     */
    async reserveListItemId() {
        return Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_3__[/* spPost */ "d"])(List(this, "reservelistitemid"));
    }
    /**
     * Creates an item using path (in a folder), validates and sets its field values.
     *
     * @param formValues The fields to change and their new values.
     * @param decodedUrl Path decoded url; folder's server relative path.
     * @param bNewDocumentUpdate true if the list item is a document being updated after upload; otherwise false.
     * @param checkInComment Optional check in comment.
     * @param additionalProps Optional set of additional properties LeafName new document file name,
     */
    async addValidateUpdateItemUsingPath(formValues, decodedUrl, bNewDocumentUpdate = false, checkInComment, additionalProps) {
        const addProps = {
            FolderPath: Object(_utils_to_resource_path_js__WEBPACK_IMPORTED_MODULE_6__[/* toResourcePath */ "e"])(decodedUrl),
        };
        if (Object(_pnp_core__WEBPACK_IMPORTED_MODULE_1__[/* objectDefinedNotNull */ "g"])(additionalProps)) {
            if (additionalProps.leafName) {
                addProps.LeafName = Object(_utils_to_resource_path_js__WEBPACK_IMPORTED_MODULE_6__[/* toResourcePath */ "e"])(additionalProps.leafName);
            }
            if (additionalProps.objectType) {
                addProps.UnderlyingObjectType = additionalProps.objectType;
            }
        }
        return Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_3__[/* spPost */ "d"])(List(this, "AddValidateUpdateItemUsingPath()"), Object(_pnp_queryable__WEBPACK_IMPORTED_MODULE_2__[/* body */ "d"])({
            bNewDocumentUpdate,
            checkInComment,
            formValues,
            listItemCreateInfo: addProps,
        }));
    }
    /**
     * Gets the parent information for this item's list and web
     */
    async getParentInfos() {
        const urlInfo = await this.select("Id", "RootFolder/UniqueId", "RootFolder/ServerRelativeUrl", "RootFolder/ServerRelativePath", "ParentWeb/Id", "ParentWeb/Url", "ParentWeb/ServerRelativeUrl", "ParentWeb/ServerRelativePath").expand("RootFolder", "ParentWeb")();
        return {
            List: {
                Id: urlInfo.Id,
                RootFolderServerRelativePath: urlInfo.RootFolder.ServerRelativePath,
                RootFolderServerRelativeUrl: urlInfo.RootFolder.ServerRelativeUrl,
                RootFolderUniqueId: urlInfo.RootFolder.UniqueId,
            },
            ParentWeb: {
                Id: urlInfo.ParentWeb.Id,
                ServerRelativePath: urlInfo.ParentWeb.ServerRelativePath,
                ServerRelativeUrl: urlInfo.ParentWeb.ServerRelativeUrl,
                Url: urlInfo.ParentWeb.Url,
            },
        };
    }
}
const List = Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_3__[/* spInvokableFactory */ "c"])(_List);
/**
 * Enum representing the options of the RenderOptions property on IRenderListDataParameters interface
 */
var RenderListDataOptions;
(function (RenderListDataOptions) {
    RenderListDataOptions[RenderListDataOptions["None"] = 0] = "None";
    RenderListDataOptions[RenderListDataOptions["ContextInfo"] = 1] = "ContextInfo";
    RenderListDataOptions[RenderListDataOptions["ListData"] = 2] = "ListData";
    RenderListDataOptions[RenderListDataOptions["ListSchema"] = 4] = "ListSchema";
    RenderListDataOptions[RenderListDataOptions["MenuView"] = 8] = "MenuView";
    RenderListDataOptions[RenderListDataOptions["ListContentType"] = 16] = "ListContentType";
    /**
     * The returned list will have a FileSystemItemId field on each item if possible.
     */
    RenderListDataOptions[RenderListDataOptions["FileSystemItemId"] = 32] = "FileSystemItemId";
    /**
     * Returns the client form schema to add and edit items.
     */
    RenderListDataOptions[RenderListDataOptions["ClientFormSchema"] = 64] = "ClientFormSchema";
    /**
     * Returns QuickLaunch navigation nodes.
     */
    RenderListDataOptions[RenderListDataOptions["QuickLaunch"] = 128] = "QuickLaunch";
    /**
     * Returns Spotlight rendering information.
     */
    RenderListDataOptions[RenderListDataOptions["Spotlight"] = 256] = "Spotlight";
    /**
     * Returns Visualization rendering information.
     */
    RenderListDataOptions[RenderListDataOptions["Visualization"] = 512] = "Visualization";
    /**
     * Returns view XML and other information about the current view.
     */
    RenderListDataOptions[RenderListDataOptions["ViewMetadata"] = 1024] = "ViewMetadata";
    /**
     * Prevents AutoHyperlink from being run on text fields in this query.
     */
    RenderListDataOptions[RenderListDataOptions["DisableAutoHyperlink"] = 2048] = "DisableAutoHyperlink";
    /**
     * Enables urls pointing to Media TA service, such as .thumbnailUrl, .videoManifestUrl, .pdfConversionUrls.
     */
    RenderListDataOptions[RenderListDataOptions["EnableMediaTAUrls"] = 4096] = "EnableMediaTAUrls";
    /**
     * Return Parant folder information.
     */
    RenderListDataOptions[RenderListDataOptions["ParentInfo"] = 8192] = "ParentInfo";
    /**
     * Return Page context info for the current list being rendered.
     */
    RenderListDataOptions[RenderListDataOptions["PageContextInfo"] = 16384] = "PageContextInfo";
    /**
     * Return client-side component manifest information associated with the list.
     */
    RenderListDataOptions[RenderListDataOptions["ClientSideComponentManifest"] = 32768] = "ClientSideComponentManifest";
    /**
     * Return all content-types available on the list.
     */
    RenderListDataOptions[RenderListDataOptions["ListAvailableContentTypes"] = 65536] = "ListAvailableContentTypes";
    /**
      * Return the order of items in the new-item menu.
      */
    RenderListDataOptions[RenderListDataOptions["FolderContentTypeOrder"] = 131072] = "FolderContentTypeOrder";
    /**
     * Return information to initialize Grid for quick edit.
     */
    RenderListDataOptions[RenderListDataOptions["GridInitInfo"] = 262144] = "GridInitInfo";
    /**
     * Indicator if the vroom API of the SPItemUrl returned in MediaTAUrlGenerator should use site url as host.
     */
    RenderListDataOptions[RenderListDataOptions["SiteUrlAsMediaTASPItemHost"] = 524288] = "SiteUrlAsMediaTASPItemHost";
    /**
     * Return the files representing mount points in the list.
     */
    RenderListDataOptions[RenderListDataOptions["AddToOneDrive"] = 1048576] = "AddToOneDrive";
    /**
     * Return SPFX CustomAction.
     */
    RenderListDataOptions[RenderListDataOptions["SPFXCustomActions"] = 2097152] = "SPFXCustomActions";
    /**
     * Do not return non-SPFX CustomAction.
     */
    RenderListDataOptions[RenderListDataOptions["CustomActions"] = 4194304] = "CustomActions";
})(RenderListDataOptions || (RenderListDataOptions = {}));
/**
 * Determines the display mode of the given control or view
 */
var ControlMode;
(function (ControlMode) {
    ControlMode[ControlMode["Display"] = 1] = "Display";
    ControlMode[ControlMode["Edit"] = 2] = "Edit";
    ControlMode[ControlMode["New"] = 3] = "New";
})(ControlMode || (ControlMode = {}));
//# sourceMappingURL=types.js.map

/***/ }),

/***/ "i1YX":
/*!**************************************************************!*\
  !*** ./lib/webparts/auresApp/components/AuresApp.module.css ***!
  \**************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var content = __webpack_require__(/*! !../../../../node_modules/@microsoft/spfx-heft-plugins/node_modules/css-loader/dist/cjs.js!../../../../node_modules/@microsoft/spfx-heft-plugins/node_modules/postcss-loader/dist/cjs.js??ref--6-2!./AuresApp.module.css */ "9iM+");
var loader = __webpack_require__(/*! ./node_modules/@microsoft/spfx-heft-plugins/node_modules/@microsoft/load-themed-styles/lib/index.js */ "pncs");

if(typeof content === "string") content = [[module.i, content]];

// add the styles to the DOM
for (var i = 0; i < content.length; i++) loader.loadStyles(content[i][1], true);

if(content.locals) module.exports = content.locals;

/***/ }),

/***/ "im7C":
/*!*************************************!*\
  !*** ./lib/services/RoleService.js ***!
  \*************************************/
/*! exports provided: RoleService */
/*! exports used: RoleService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return RoleService; });
/* harmony import */ var _pnp_sp_webs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @pnp/sp/webs */ "6k7F");
/* harmony import */ var _pnp_sp_site_users_web__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @pnp/sp/site-users/web */ "EjWy");
/* harmony import */ var _interfaces__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./interfaces */ "FFPM");
/* harmony import */ var _MentoringService__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./MentoringService */ "39m/");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};




/** Nazev SP skupiny, jejiz clenove maji roli HR */
var HR_GROUP_NAME = 'Aures Mentoring HR';
var RoleService = /** @class */ (function () {
    function RoleService(_sp) {
        this._sp = _sp;
        this._mentoring = new _MentoringService__WEBPACK_IMPORTED_MODULE_3__[/* MentoringService */ "e"](_sp);
    }
    /**
     * Zjisti aktualne prihlaseneho uzivatele a jeho role.
     * Role se detekuji paralelne — uzivatel muze mit vice roli zaroven (napr. Talent + Mentor).
     */
    RoleService.prototype.getCurrentUser = function () {
        return __awaiter(this, void 0, void 0, function () {
            var spUser, _a, mentorRecord, talentRecord, isHR, roles;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this._sp.web.currentUser()];
                    case 1:
                        spUser = _b.sent();
                        return [4 /*yield*/, Promise.all([
                                this._mentoring.getMentorByEmail(spUser.Email),
                                this._mentoring.getTalentByEmail(spUser.Email),
                                this._checkHRMembership(spUser.Id)
                            ])];
                    case 2:
                        _a = _b.sent(), mentorRecord = _a[0], talentRecord = _a[1], isHR = _a[2];
                        roles = this._resolveRoles(mentorRecord, talentRecord, isHR);
                        return [2 /*return*/, {
                                id: spUser.Id,
                                title: spUser.Title,
                                email: spUser.Email,
                                roles: roles,
                                mentorRecord: mentorRecord,
                                talentRecord: talentRecord
                            }];
                }
            });
        });
    };
    // ----------------------------------------------------------------
    // Soukrome helpery
    // ----------------------------------------------------------------
    RoleService.prototype._resolveRoles = function (mentor, talent, isHR) {
        var roles = [];
        if (mentor)
            roles.push(_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* UserRole */ "n"].Mentor);
        if (talent)
            roles.push(_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* UserRole */ "n"].Talent);
        if (isHR)
            roles.push(_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* UserRole */ "n"].HR);
        if (roles.length === 0)
            roles.push(_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* UserRole */ "n"].Unknown);
        return roles;
    };
    /**
     * Zkontroluje, zda uzivatel patri do SP skupiny HR_GROUP_NAME.
     * Pokud skupina neexistuje nebo nastane jina chyba, vraci false (fail-safe).
     */
    RoleService.prototype._checkHRMembership = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var groups, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this._sp.web.siteUsers
                                .getById(userId)
                                .groups()];
                    case 1:
                        groups = _b.sent();
                        return [2 /*return*/, groups.some(function (g) { return g.Title === HR_GROUP_NAME; })];
                    case 2:
                        _a = _b.sent();
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return RoleService;
}());



/***/ }),

/***/ "jdhR":
/*!******************************************************!*\
  !*** ./lib/webparts/auresApp/components/AppShell.js ***!
  \******************************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "cDcd");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AuresApp.module.scss */ "sg2l");
/* harmony import */ var _services_interfaces__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../services/interfaces */ "FFPM");
var _a;



var TALENT_TABS_BASE = [
    { label: 'Katalog mentorů', view: 'MentorCatalog' },
];
var TALENT_TABS_WITH_REQUESTS = [
    { label: 'Katalog mentorů', view: 'MentorCatalog' },
    { label: 'Moje žádosti', view: 'MyRequests' },
    { label: 'Změna volby', view: 'ResetChoice' },
];
var MENTOR_TABS = [
    { label: 'Čekající žádosti', view: 'PendingRequests' },
    { label: 'Historie', view: 'RequestHistory' },
];
var HR_TABS = [
    { label: 'Čeká', view: 'AllRequests' },
    { label: 'Domluvené mentoringy', view: 'ApprovedMentorings' },
    { label: 'Mentoři', view: 'MentorManagement' },
    { label: 'Talenti', view: 'TalentManagement' },
    { label: 'Kapacita', view: 'CapacityDashboard' },
];
var ROLE_LABELS = (_a = {},
    _a[_services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* UserRole */ "n"].Talent] = 'Talent',
    _a[_services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* UserRole */ "n"].Mentor] = 'Mentor',
    _a[_services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* UserRole */ "n"].HR] = 'HR Admin',
    _a);
var NAVIGABLE_ROLES = [_services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* UserRole */ "n"].Talent, _services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* UserRole */ "n"].Mentor, _services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* UserRole */ "n"].HR];
var AppShell = function (_a) {
    var currentUser = _a.currentUser, currentView = _a.currentView, navigate = _a.navigate, children = _a.children, navBadges = _a.navBadges, hasActiveRequests = _a.hasActiveRequests;
    var navigableRoles = currentUser.roles.filter(function (r) { return NAVIGABLE_ROLES.includes(r); });
    var _b = react__WEBPACK_IMPORTED_MODULE_0__["useState"](navigableRoles[0]), activeRole = _b[0], setActiveRole = _b[1];
    var getTabsForRole = function (role) {
        if (role === _services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* UserRole */ "n"].Talent) {
            return hasActiveRequests ? TALENT_TABS_WITH_REQUESTS : TALENT_TABS_BASE;
        }
        if (role === _services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* UserRole */ "n"].Mentor)
            return MENTOR_TABS;
        if (role === _services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* UserRole */ "n"].HR)
            return HR_TABS;
        return [];
    };
    var tabs = getTabsForRole(activeRole);
    var handleRoleSwitch = function (role) {
        setActiveRole(role);
        var defaultTab = getTabsForRole(role)[0];
        if (defaultTab)
            navigate(defaultTab.view);
    };
    return (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].appShell },
        react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("header", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].header },
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].headerLeft },
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].headerLogo }, "AURES"),
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("span", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].headerTitle },
                    react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("span", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].headerTitleAccent }, "ELITE"),
                    ' MENTORING')),
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("span", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].headerUser }, currentUser.title)),
        navigableRoles.length > 1 && (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].roleSwitch }, navigableRoles.map(function (role) {
            var _a;
            return (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("button", { key: role, className: role === activeRole ? _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].roleBtnActive : _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].roleBtn, onClick: function () { return handleRoleSwitch(role); } }, (_a = ROLE_LABELS[role]) !== null && _a !== void 0 ? _a : role));
        }))),
        react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("nav", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].nav }, tabs.map(function (tab) {
            var _a;
            var badge = (_a = navBadges === null || navBadges === void 0 ? void 0 : navBadges[tab.view]) !== null && _a !== void 0 ? _a : 0;
            return (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("button", { key: tab.view, className: currentView === tab.view ? _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].navTabActive : _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].navTab, onClick: function () { return navigate(tab.view); } },
                tab.label,
                badge > 0 && react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("span", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].navBadge }, badge)));
        })),
        react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("main", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].content }, children)));
};
/* harmony default export */ __webpack_exports__["e"] = (AppShell);


/***/ }),

/***/ "l2Og":
/*!*****************************************************************!*\
  !*** ./lib/webparts/auresApp/components/hr/TalentManagement.js ***!
  \*****************************************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "cDcd");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../AuresApp.module.scss */ "sg2l");
/* harmony import */ var _services_MentoringService__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../services/MentoringService */ "39m/");
/* harmony import */ var _utils_mockData__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../utils/mockData */ "IxoJ");
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};




var TalentManagement = function (_a) {
    var sp = _a.sp;
    var _b = react__WEBPACK_IMPORTED_MODULE_0__["useState"]([]), talents = _b[0], setTalents = _b[1];
    var _c = react__WEBPACK_IMPORTED_MODULE_0__["useState"](true), loading = _c[0], setLoading = _c[1];
    react__WEBPACK_IMPORTED_MODULE_0__["useEffect"](function () {
        new _services_MentoringService__WEBPACK_IMPORTED_MODULE_2__[/* MentoringService */ "e"](sp).getAllTalentsForAdmin()
            .then(setTalents)
            .catch(function () { return setTalents(_utils_mockData__WEBPACK_IMPORTED_MODULE_3__[/* MOCK_TALENTS */ "n"]); })
            .finally(function () { return setLoading(false); });
    }, [sp]);
    var toggleActive = function (talent) { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, new _services_MentoringService__WEBPACK_IMPORTED_MODULE_2__[/* MentoringService */ "e"](sp).setTalentActive(talent.Id, !talent.IsActive)];
                case 1:
                    _b.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = _b.sent();
                    return [3 /*break*/, 3];
                case 3:
                    setTalents(function (prev) { return prev.map(function (t) { return t.Id === talent.Id ? __assign(__assign({}, t), { IsActive: !t.IsActive }) : t; }); });
                    return [2 /*return*/];
            }
        });
    }); };
    if (loading)
        return react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].loading }, "Na\u010D\u00EDt\u00E1m talenty\u2026");
    return (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", null,
        react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("h2", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].pageTitle },
            "Spr\u00E1va talent\u016F (",
            talents.length,
            ")"),
        react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].managementList }, talents.map(function (talent) { return (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { key: talent.Id, className: [_AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].managementRow, !talent.IsActive ? _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].managementRowInactive : ''].filter(Boolean).join(' ') },
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].managementInfo },
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("p", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].managementName }, talent.Title),
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("p", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].managementMeta }, talent.TalentUser.EMail)),
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("button", { className: talent.IsActive ? _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].activeBtn : _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].inactiveBtn, onClick: function () { void toggleActive(talent); } }, talent.IsActive ? 'Aktivní' : 'Neaktivní'))); }))));
};
/* harmony default export */ __webpack_exports__["e"] = (TalentManagement);


/***/ }),

/***/ "lYrR":
/*!*********************************************!*\
  !*** ./node_modules/@pnp/sp/items/index.js ***!
  \*********************************************/
/*! exports provided: Item, Items, ItemVersion, ItemVersions */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _list_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./list.js */ "NTTg");
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./types.js */ "3DT9");


//# sourceMappingURL=index.js.map

/***/ }),

/***/ "lZLn":
/*!***********************************************************!*\
  !*** ./node_modules/@pnp/sp/utils/create-change-token.js ***!
  \***********************************************************/
/*! exports provided: createChangeToken */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export createChangeToken */
/**
 * Creates a change token for use with sites, webs, or lists
 *
 * @param resourceType The type of resource for which you want a change token
 * @param resource The identifier (GUID) of the resource site.Id, web.Id, or List.Id
 * @param tokenDate The date for this token (if start token, start date of chages; if end token, end date of the changes)
 * @param versionNumber Version number for token (default = 1)
 * @returns A properly formatted change token
 */
function createChangeToken(resourceType = "site", resource, tokenDate = new Date(), versionNumber = 1) {
    const resourceTypeMapping = new Map([["site", 1], ["web", 2], ["list", 3]]).get(resourceType);
    // The value of the string assigned to ChangeTokenStart.StringValue is semicolon delimited, and takes the following parameters in the order listed:
    // Version number.
    // The change scope (0 - Content Database, 1 - site collection, 2 - site, 3 - list).
    // GUID of the item the scope applies to (for example, GUID of the list).
    // Time (in UTC) from when changes occurred in Ticks (but its .NET ticks so we do this math)
    // Initialize the change item on the ChangeToken using a default value of -1.
    const tokenDateTicks = (tokenDate.getTime() * 10000) + 621355968000000000;
    return { StringValue: `${versionNumber};${resourceTypeMapping};${resource};${tokenDateTicks};-1` };
}
//# sourceMappingURL=create-change-token.js.map

/***/ }),

/***/ "mGT/":
/*!****************************************************************!*\
  !*** ./lib/webparts/auresApp/components/talent/RequestForm.js ***!
  \****************************************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "cDcd");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../AuresApp.module.scss */ "sg2l");
/* harmony import */ var _services_interfaces__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../services/interfaces */ "FFPM");
/* harmony import */ var _services_MentoringService__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../services/MentoringService */ "39m/");
/* harmony import */ var _services_NotificationService__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../services/NotificationService */ "PFk9");
/* harmony import */ var _utils_mockData__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../utils/mockData */ "IxoJ");
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};






var RequestForm = function (_a) {
    var _b;
    var sp = _a.sp, currentUser = _a.currentUser, navigate = _a.navigate, preselectedMentorId = _a.preselectedMentorId;
    var _c = react__WEBPACK_IMPORTED_MODULE_0__["useState"]([]), mentors = _c[0], setMentors = _c[1];
    var _d = react__WEBPACK_IMPORTED_MODULE_0__["useState"](true), loading = _d[0], setLoading = _d[1];
    var _e = react__WEBPACK_IMPORTED_MODULE_0__["useState"](false), submitting = _e[0], setSubmitting = _e[1];
    var _f = react__WEBPACK_IMPORTED_MODULE_0__["useState"](null), error = _f[0], setError = _f[1];
    var _g = react__WEBPACK_IMPORTED_MODULE_0__["useState"](false), hasActiveRequest = _g[0], setHasActiveRequest = _g[1];
    var _h = react__WEBPACK_IMPORTED_MODULE_0__["useState"](null), secondaryId = _h[0], setSecondaryId = _h[1];
    var _j = react__WEBPACK_IMPORTED_MODULE_0__["useState"](null), tertiaryId = _j[0], setTertiaryId = _j[1];
    var _k = react__WEBPACK_IMPORTED_MODULE_0__["useState"]({}), messages = _k[0], setMessages = _k[1];
    react__WEBPACK_IMPORTED_MODULE_0__["useEffect"](function () {
        var _a;
        var talentId = (_a = currentUser.talentRecord) === null || _a === void 0 ? void 0 : _a.Id;
        var svc = new _services_MentoringService__WEBPACK_IMPORTED_MODULE_3__[/* MentoringService */ "e"](sp);
        Promise.all([
            svc.getMentors(),
            talentId ? svc.getMyRequests(talentId) : Promise.resolve([])
        ])
            .then(function (_a) {
            var mentorsData = _a[0], myReqs = _a[1];
            setMentors(mentorsData);
            var active = myReqs.some(function (r) {
                return [_services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* RequestStatus */ "e"].Pending, _services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* RequestStatus */ "e"].Approved, _services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* RequestStatus */ "e"].HR_Review, _services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* RequestStatus */ "e"].Scheduled].includes(r.RequestStatus);
            });
            setHasActiveRequest(active);
        })
            .catch(function () {
            setMentors(_utils_mockData__WEBPACK_IMPORTED_MODULE_5__[/* MOCK_MENTORS */ "e"].filter(function (m) { return m.IsActive; }));
            var active = _utils_mockData__WEBPACK_IMPORTED_MODULE_5__[/* MOCK_REQUESTS */ "t"].some(function (r) {
                var _a;
                return ((_a = r.TalentRef) === null || _a === void 0 ? void 0 : _a.Id) === talentId &&
                    [_services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* RequestStatus */ "e"].Pending, _services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* RequestStatus */ "e"].Approved, _services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* RequestStatus */ "e"].HR_Review, _services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* RequestStatus */ "e"].Scheduled].includes(r.RequestStatus);
            });
            setHasActiveRequest(active);
        })
            .finally(function () { return setLoading(false); });
    }, [sp, currentUser]);
    var setMessage = function (mentorId, msg) {
        setMessages(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[mentorId] = msg, _a)));
        });
    };
    var handleSubmit = function () { return __awaiter(void 0, void 0, void 0, function () {
        var talentId, mentorIds, msgs, newId_1, _a;
        var _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    if (!preselectedMentorId) {
                        setError('Nebyl zvolen primární mentor.');
                        return [2 /*return*/];
                    }
                    setError(null);
                    setSubmitting(true);
                    _g.label = 1;
                case 1:
                    _g.trys.push([1, 3, 4, 5]);
                    talentId = (_c = (_b = currentUser.talentRecord) === null || _b === void 0 ? void 0 : _b.Id) !== null && _c !== void 0 ? _c : 0;
                    mentorIds = [
                        preselectedMentorId,
                        secondaryId !== null && secondaryId !== void 0 ? secondaryId : undefined,
                        tertiaryId !== null && tertiaryId !== void 0 ? tertiaryId : undefined
                    ];
                    msgs = [
                        ((_d = messages[preselectedMentorId]) !== null && _d !== void 0 ? _d : '').trim(),
                        secondaryId != null ? ((_e = messages[secondaryId]) !== null && _e !== void 0 ? _e : '').trim() : undefined,
                        tertiaryId != null ? ((_f = messages[tertiaryId]) !== null && _f !== void 0 ? _f : '').trim() : undefined
                    ];
                    return [4 /*yield*/, new _services_MentoringService__WEBPACK_IMPORTED_MODULE_3__[/* MentoringService */ "e"](sp).submitRequest(talentId, mentorIds, msgs)];
                case 2:
                    newId_1 = _g.sent();
                    void (function () { return __awaiter(void 0, void 0, void 0, function () {
                        var mentor1, _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 3, , 4]);
                                    mentor1 = mentors.find(function (m) { return m.Id === preselectedMentorId; });
                                    if (!(mentor1 && currentUser.talentRecord)) return [3 /*break*/, 2];
                                    return [4 /*yield*/, new _services_NotificationService__WEBPACK_IMPORTED_MODULE_4__[/* NotificationService */ "e"](sp).notifyMentorOnSubmit(mentor1, currentUser.talentRecord, newId_1, "REQ-2026-".concat(newId_1))];
                                case 1:
                                    _b.sent();
                                    _b.label = 2;
                                case 2: return [3 /*break*/, 4];
                                case 3:
                                    _a = _b.sent();
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); })();
                    navigate('MyRequests');
                    return [3 /*break*/, 5];
                case 3:
                    _a = _g.sent();
                    setError('Nepodařilo se odeslat žádost. Zkus to znovu.');
                    return [3 /*break*/, 5];
                case 4:
                    setSubmitting(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    if (loading)
        return react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].loading }, "Na\u010D\u00EDt\u00E1m mentory\u2026");
    if (hasActiveRequest) {
        return (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].emptyState },
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("p", null, "Ji\u017E m\u00E1\u0161 aktivn\u00ED \u017E\u00E1dost o mentoring. Pokud chce\u0161 podat novou, mus\u00ED\u0161 svou volbu nejprve resetovat."),
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("button", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].btnPrimary, onClick: function () { return navigate('MyRequests'); } }, "P\u0159ej\u00EDt na Moje \u017E\u00E1dosti")));
    }
    var primaryMentor = mentors.find(function (m) { return m.Id === preselectedMentorId; });
    var otherMentors = mentors.filter(function (m) { return m.Id !== preselectedMentorId; });
    if (!primaryMentor) {
        return (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].emptyState },
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("p", null, "Mentor nebyl nalezen."),
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("button", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].btnPrimary, onClick: function () { return navigate('MentorCatalog'); } }, "Zp\u011Bt na katalog")));
    }
    return (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].requestForm },
        react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("h2", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].pageTitle }, "Nov\u00E1 \u017E\u00E1dost o mentoring"),
        react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].formSection },
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("h3", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].formSectionTitle }, "Tv\u016Fj vybran\u00FD mentor"),
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].primaryMentorCard },
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].primaryMentorHeader },
                    react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].primaryMentorAvatar }, getInitials(primaryMentor.Title)),
                    react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].primaryMentorInfo },
                        react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("p", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].primaryMentorName }, primaryMentor.Title),
                        react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("p", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].primaryMentorJobTitle }, primaryMentor.JobTitle),
                        react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("p", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].primaryMentorSuperpower }, primaryMentor.Superpower)),
                    react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("span", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].primaryMentorBadge }, "Prim\u00E1rn\u00ED mentor")),
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("p", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].primaryMentorBio }, primaryMentor.Bio))),
        otherMentors.length > 0 && (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].formSection },
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("h3", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].formSectionTitle }, "Z\u00E1lo\u017En\u00ED mento\u0159i"),
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("p", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].formSectionHint }, "Pokud vybran\u00FD mentor nebude m\u00EDt kapacitu, syst\u00E9m automaticky oslov\u00ED z\u00E1lo\u017En\u00EDho mentora. Vyber si sekund\u00E1rn\u00EDho a p\u0159\u00EDpadn\u011B terci\u00E1ln\u00EDho mentora."),
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].backupMentorList }, otherMentors.map(function (mentor) {
                var isSecondary = secondaryId === mentor.Id;
                var isTertiary = tertiaryId === mentor.Id;
                var isSelected = isSecondary || isTertiary;
                return (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { key: mentor.Id, className: [
                        _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].backupMentorRow,
                        isSelected ? _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].backupMentorRowSelected : ''
                    ].filter(Boolean).join(' ') },
                    react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].backupMentorInfo },
                        react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].mentorAvatar }, getInitials(mentor.Title)),
                        react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", null,
                            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("p", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].mentorSelectName }, mentor.Title),
                            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("p", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].mentorSelectJobTitle },
                                mentor.JobTitle,
                                " \u00B7 ",
                                mentor.Superpower))),
                    react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].backupMentorActions },
                        isSecondary && react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("span", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].backupMentorLabel }, "Sekund\u00E1rn\u00ED"),
                        isTertiary && react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("span", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].backupMentorLabelTertiary }, "Terci\u00E1ln\u00ED"),
                        isSelected ? (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("button", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].btnSecondary, onClick: function () {
                                if (isSecondary) {
                                    setSecondaryId(tertiaryId);
                                    setTertiaryId(null);
                                }
                                else {
                                    setTertiaryId(null);
                                }
                            } }, "Odebrat")) : (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("button", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].btnSecondary, disabled: secondaryId !== null && tertiaryId !== null, onClick: function () {
                                if (secondaryId === null)
                                    setSecondaryId(mentor.Id);
                                else if (tertiaryId === null)
                                    setTertiaryId(mentor.Id);
                            } }, secondaryId === null ? 'Zvolit jako sekundárního' : 'Zvolit jako terciálního')))));
            })))),
        react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].formSection },
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("h3", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].formSectionTitle }, "Zpr\u00E1vy mentor\u016Fm"),
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("p", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].formSectionHint }, "Pokud chce\u0161, m\u016F\u017Ee\u0161 mentorovi napsat zpr\u00E1vu \u2014 pro\u010D m\u00E1\u0161 o n\u011Bj z\u00E1jem, co od mentoringu o\u010Dek\u00E1v\u00E1\u0161, nebo cokoliv dal\u0161\u00EDho. Zpr\u00E1va nen\u00ED povinn\u00E1."),
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].messageGroup },
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("label", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].messageLabel },
                    "Zpr\u00E1va pro ",
                    primaryMentor.Title,
                    " (prim\u00E1rn\u00ED)"),
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("textarea", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].messageTextarea, value: (_b = messages[primaryMentor.Id]) !== null && _b !== void 0 ? _b : '', onChange: function (e) { return setMessage(primaryMentor.Id, e.target.value); }, placeholder: "Napi\u0161, pro\u010D t\u011B zaj\u00EDm\u00E1 mentoring od ".concat(primaryMentor.Title, "\u2026"), rows: 3 })),
            secondaryId != null && (function () {
                var _a;
                var m = mentors.find(function (x) { return x.Id === secondaryId; });
                return m ? (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].messageGroup },
                    react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("label", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].messageLabel },
                        "Zpr\u00E1va pro ",
                        m.Title,
                        " (sekund\u00E1rn\u00ED)"),
                    react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("textarea", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].messageTextarea, value: (_a = messages[secondaryId]) !== null && _a !== void 0 ? _a : '', onChange: function (e) { return setMessage(secondaryId, e.target.value); }, placeholder: "Napi\u0161, pro\u010D t\u011B zaj\u00EDm\u00E1 mentoring od ".concat(m.Title, "\u2026"), rows: 3 }))) : null;
            })(),
            tertiaryId != null && (function () {
                var _a;
                var m = mentors.find(function (x) { return x.Id === tertiaryId; });
                return m ? (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].messageGroup },
                    react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("label", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].messageLabel },
                        "Zpr\u00E1va pro ",
                        m.Title,
                        " (terci\u00E1ln\u00ED)"),
                    react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("textarea", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].messageTextarea, value: (_a = messages[tertiaryId]) !== null && _a !== void 0 ? _a : '', onChange: function (e) { return setMessage(tertiaryId, e.target.value); }, placeholder: "Napi\u0161, pro\u010D t\u011B zaj\u00EDm\u00E1 mentoring od ".concat(m.Title, "\u2026"), rows: 3 }))) : null;
            })()),
        react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].formActions },
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("button", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].btnPrimary, onClick: function () { void handleSubmit(); }, disabled: submitting }, submitting ? 'Odesílám…' : 'Odeslat žádost'),
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("button", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].btnSecondary, onClick: function () { return navigate('MentorCatalog'); }, disabled: submitting }, "Zp\u011Bt na katalog"),
            error && react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("span", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].formError }, error))));
};
function getInitials(name) {
    var parts = name.trim().split(/\s+/);
    if (parts.length >= 2)
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
}
/* harmony default export */ __webpack_exports__["e"] = (RequestForm);


/***/ }),

/***/ "nikm":
/*!*****************************************************!*\
  !*** ./node_modules/@pnp/sp/behaviors/telemetry.js ***!
  \*****************************************************/
/*! exports provided: Telemetry */
/*! exports used: Telemetry */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return Telemetry; });
/* harmony import */ var _pnp_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @pnp/core */ "JC1J");

function Telemetry() {
    return (instance) => {
        instance.on.pre(async function (url, init, result) {
            let clientTag = "PnPCoreJS:4.18.0:";
            // make our best guess based on url to the method called
            const { pathname } = new URL(url);
            // remove anything before the _api as that is potentially PII and we don't care, just want to get the called path to the REST API
            // and we want to modify any (*) calls at the end such as items(3) and items(344) so we just track "items()"
            clientTag = pathname.split("/")
                .filter((v) => !Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* stringIsNullOrEmpty */ "S"])(v) && ["_api", "v2.1", "v2.0"].indexOf(v) < 0)
                .map((value, index, arr) => index === arr.length - 1 ? value.replace(/\(.*?$/i, "()") : value[0])
                .join(".");
            if (clientTag.length > 32) {
                clientTag = clientTag.substring(0, 32);
            }
            this.log(`Request Tag: ${clientTag}`, 0);
            init.headers = { ...init.headers, ["X-ClientService-ClientTag"]: clientTag };
            return [url, init, result];
        });
        return instance;
    };
}
//# sourceMappingURL=telemetry.js.map

/***/ }),

/***/ "pAcn":
/*!******************************************!*\
  !*** ./node_modules/@pnp/sp/batching.js ***!
  \******************************************/
/*! exports provided: createBatch, BatchNever */
/*! exports used: BatchNever */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export createBatch */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return BatchNever; });
/* harmony import */ var _pnp_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @pnp/core */ "JC1J");
/* harmony import */ var _pnp_queryable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @pnp/queryable */ "Ymo3");
/* harmony import */ var _spqueryable_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./spqueryable.js */ "F4qD");
/* harmony import */ var _fi_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./fi.js */ "v6VW");
/* harmony import */ var _webs_types_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./webs/types.js */ "dVsc");





_fi_js__WEBPACK_IMPORTED_MODULE_3__[/* SPFI */ "e"].prototype.batched = function (props) {
    const batched = Object(_fi_js__WEBPACK_IMPORTED_MODULE_3__[/* spfi */ "t"])(this);
    const [behavior, execute] = createBatch(batched._root, props);
    batched.using(behavior);
    return [batched, execute];
};
_webs_types_js__WEBPACK_IMPORTED_MODULE_4__[/* _Web */ "t"].prototype.batched = function (props) {
    const batched = Object(_webs_types_js__WEBPACK_IMPORTED_MODULE_4__[/* Web */ "e"])(this);
    const [behavior, execute] = createBatch(batched, props);
    batched.using(behavior);
    return [batched, execute];
};
/**
 * Tracks on a batched instance that registration is complete (the child request has gotten to the send moment and the request is included in the batch)
 */
const RegistrationCompleteSym = Symbol.for("batch_registration");
/**
 * Tracks on a batched instance that the child request timeline lifecycle is complete (called in child.dispose)
 */
const RequestCompleteSym = Symbol.for("batch_request");
/**
 * Special batch parsing behavior used to convert the batch response text into a set of Response objects for each request
 * @returns A parser behavior
 */
function BatchParse() {
    return Object(_pnp_queryable__WEBPACK_IMPORTED_MODULE_1__[/* parseBinderWithErrorCheck */ "m"])(async (response) => {
        const text = await response.text();
        return parseResponse(text);
    });
}
/**
 * Internal class used to execute the batch request through the timeline lifecycle
 */
class BatchQueryable extends _spqueryable_js__WEBPACK_IMPORTED_MODULE_2__[/* _SPQueryable */ "r"] {
    constructor(base, requestBaseUrl = base.toUrl().replace(/_api[\\|/].*$/i, "")) {
        super(requestBaseUrl, "_api/$batch");
        this.requestBaseUrl = requestBaseUrl;
        // this will copy over the current observables from the base associated with this batch
        // this will replace any other parsing present
        this.using(Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* CopyFrom */ "e"])(base, "replace"), BatchParse());
        this.on.dispose(() => {
            // there is a code path where you may invoke a batch, say on items.add, whose return
            // is an object like { data: any, item: IItem }. The expectation from v1 on is `item` in that object
            // is immediately usable to make additional queries. Without this step when that IItem instance is
            // created using "this.getById" within IITems.add all of the current observers of "this" are
            // linked to the IItem instance created (expected), BUT they will be the set of observers setup
            // to handle the batch, meaning invoking `item` will result in a half batched call that
            // doesn't really work. To deliver the expected functionality we "reset" the
            // observers using the original instance, mimicing the behavior had
            // the IItem been created from that base without a batch involved. We use CopyFrom to ensure
            // that we maintain the references to the InternalResolve and InternalReject events through
            // the end of this timeline lifecycle. This works because CopyFrom by design uses Object.keys
            // which ignores symbol properties.
            base.using(Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* CopyFrom */ "e"])(this, "replace", (k) => /(auth|send|pre|init)/i.test(k)));
        });
    }
}
/**
 * Creates a batched version of the supplied base, meaning that all chained fluent operations from the new base are part of the batch
 *
 * @param base The base from which to initialize the batch
 * @param props Any properties used to initialize the batch functionality
 * @returns A tuple of [behavior used to assign objects to the batch, the execute function used to resolve the batch requests]
 */
function createBatch(base, props) {
    const registrationPromises = [];
    const completePromises = [];
    const requests = [];
    const batchQuery = new BatchQueryable(base);
    // this id will be reused across multiple batches if the number of requests added to the batch
    // exceeds the configured maxRequests value
    const batchId = Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* getGUID */ "d"])();
    // this query is used to copy back the behaviors after the batch executes
    // it should not manipulated or have behaviors added.
    const refQuery = new BatchQueryable(base);
    const { headersCopyPattern, maxRequests } = {
        headersCopyPattern: /Accept|Content-Type|IF-Match/i,
        maxRequests: 20,
        ...props,
    };
    const execute = async () => {
        await Promise.all(registrationPromises);
        if (requests.length < 1) {
            // even if we have no requests we need to await the complete promises to ensure
            // that execute only resolves AFTER every child request disposes #2457
            // this likely means caching is being used, we returned values for all child requests from the cache
            return Promise.all(completePromises).then(() => void (0));
        }
        // create a working copy of our requests
        const requestsWorkingCopy = requests.slice();
        while (requestsWorkingCopy.length > 0) {
            const requestsChunk = requestsWorkingCopy.splice(0, maxRequests);
            const batchBody = [];
            let currentChangeSetId = "";
            for (let i = 0; i < requestsChunk.length; i++) {
                const [, url, init] = requestsChunk[i];
                if (init.method === "GET") {
                    if (currentChangeSetId.length > 0) {
                        // end an existing change set
                        batchBody.push(`--changeset_${currentChangeSetId}--\n\n`);
                        currentChangeSetId = "";
                    }
                    batchBody.push(`--batch_${batchId}\n`);
                }
                else {
                    if (currentChangeSetId.length < 1) {
                        // start new change set
                        currentChangeSetId = Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* getGUID */ "d"])();
                        batchBody.push(`--batch_${batchId}\n`);
                        batchBody.push(`Content-Type: multipart/mixed; boundary="changeset_${currentChangeSetId}"\n\n`);
                    }
                    batchBody.push(`--changeset_${currentChangeSetId}\n`);
                }
                // common batch part prefix
                batchBody.push("Content-Type: application/http\n");
                batchBody.push("Content-Transfer-Encoding: binary\n\n");
                // these are the per-request headers
                const headers = new Headers(init.headers);
                // this is the url of the individual request within the batch
                const reqUrl = Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* isUrlAbsolute */ "m"])(url) ? url : Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* combine */ "o"])(batchQuery.requestBaseUrl, url);
                if (init.method !== "GET") {
                    let method = init.method;
                    if (headers.has("X-HTTP-Method")) {
                        method = headers.get("X-HTTP-Method");
                        headers.delete("X-HTTP-Method");
                    }
                    batchBody.push(`${method} ${reqUrl} HTTP/1.1\n`);
                }
                else {
                    batchBody.push(`${init.method} ${reqUrl} HTTP/1.1\n`);
                }
                // lastly we apply any default headers we need that may not exist
                if (!headers.has("Accept")) {
                    headers.append("Accept", "application/json");
                }
                if (!headers.has("Content-Type")) {
                    headers.append("Content-Type", "application/json;charset=utf-8");
                }
                // write headers into batch body
                headers.forEach((value, name) => {
                    if (headersCopyPattern.test(name)) {
                        batchBody.push(`${name}: ${value}\n`);
                    }
                });
                batchBody.push("\n");
                if (init.body) {
                    batchBody.push(`${init.body}\n\n`);
                }
            }
            if (currentChangeSetId.length > 0) {
                // Close the changeset
                batchBody.push(`--changeset_${currentChangeSetId}--\n\n`);
                currentChangeSetId = "";
            }
            batchBody.push(`--batch_${batchId}--\n`);
            const responses = await Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_2__[/* spPost */ "d"])(batchQuery, {
                body: batchBody.join(""),
                headers: {
                    "Content-Type": `multipart/mixed; boundary=batch_${batchId}`,
                },
            });
            if (responses.length !== requestsChunk.length) {
                throw Error("Could not properly parse responses to match requests in batch.");
            }
            for (let index = 0; index < responses.length; index++) {
                // resolve the child request's send promise with the parsed response
                requestsChunk[index][3](responses[index]);
            }
        } // end of while (requestsWorkingCopy.length > 0)
        await Promise.all(completePromises).then(() => void (0));
    };
    const register = (instance) => {
        instance.on.init(function () {
            if (Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* isFunc */ "p"])(this[RegistrationCompleteSym])) {
                throw Error("This instance is already part of a batch. Please review the docs at https://pnp.github.io/pnpjs/concepts/batching#reuse.");
            }
            // we need to ensure we wait to start execute until all our batch children hit the .send method to be fully registered
            registrationPromises.push(new Promise((resolve) => {
                this[RegistrationCompleteSym] = resolve;
            }));
            return this;
        });
        instance.on.pre(async function (url, init, result) {
            // Do not add to timeline if using BatchNever behavior
            if (Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* hOP */ "u"])(init.headers, "X-PnP-BatchNever")) {
                // clean up the init operations from the timeline
                // not strictly necessary as none of the logic that uses this should be in the request, but good to keep things tidy
                if (typeof (this[RequestCompleteSym]) === "function") {
                    this[RequestCompleteSym]();
                    delete this[RequestCompleteSym];
                }
                this.using(Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* CopyFrom */ "e"])(refQuery, "replace", (k) => /(init|pre)/i.test(k)));
                return [url, init, result];
            }
            // the entire request will be auth'd - we don't need to run this for each batch request
            this.on.auth.clear();
            // we replace the send function with our batching logic
            this.on.send.replace(async function (url, init) {
                // this is the promise that Queryable will see returned from .emit.send
                const promise = new Promise((resolve) => {
                    // add the request information into the batch
                    requests.push([this, url.toString(), init, resolve]);
                });
                this.log(`[batch:${batchId}] (${(new Date()).getTime()}) Adding request ${init.method} ${url.toString()} to batch.`, 0);
                // we need to ensure we wait to resolve execute until all our batch children have fully completed their request timelines
                completePromises.push(new Promise((resolve) => {
                    this[RequestCompleteSym] = resolve;
                }));
                // indicate that registration of this request is complete
                this[RegistrationCompleteSym]();
                return promise;
            });
            this.on.dispose(function () {
                if (Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* isFunc */ "p"])(this[RegistrationCompleteSym])) {
                    // if this request is in a batch and caching is in play we need to resolve the registration promises to unblock processing of the batch
                    // because the request will never reach the "send" moment as the result is returned from "pre"
                    this[RegistrationCompleteSym]();
                    // remove the symbol props we added for good hygene
                    delete this[RegistrationCompleteSym];
                }
                if (Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* isFunc */ "p"])(this[RequestCompleteSym])) {
                    // let things know we are done with this request
                    this[RequestCompleteSym]();
                    delete this[RequestCompleteSym];
                    // there is a code path where you may invoke a batch, say on items.add, whose return
                    // is an object like { data: any, item: IItem }. The expectation from v1 on is `item` in that object
                    // is immediately usable to make additional queries. Without this step when that IItem instance is
                    // created using "this.getById" within IITems.add all of the current observers of "this" are
                    // linked to the IItem instance created (expected), BUT they will be the set of observers setup
                    // to handle the batch, meaning invoking `item` will result in a half batched call that
                    // doesn't really work. To deliver the expected functionality we "reset" the
                    // observers using the original instance, mimicing the behavior had
                    // the IItem been created from that base without a batch involved. We use CopyFrom to ensure
                    // that we maintain the references to the InternalResolve and InternalReject events through
                    // the end of this timeline lifecycle. This works because CopyFrom by design uses Object.keys
                    // which ignores symbol properties.
                    this.using(Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* CopyFrom */ "e"])(refQuery, "replace", (k) => /(auth|pre|send|init|dispose)/i.test(k)));
                }
            });
            return [url, init, result];
        });
        return instance;
    };
    return [register, execute];
}
/**
 * Behavior that blocks batching for the request regardless of "method"
 *
 * This is used for requests to bypass batching methods. Example - Request Digest where we need to get a request-digest inside of a batch.
 * @returns TimelinePipe
 */
function BatchNever() {
    return (instance) => {
        instance.on.pre.prepend(async function (url, init, result) {
            init.headers = { ...init.headers, "X-PnP-BatchNever": "1" };
            return [url, init, result];
        });
        return instance;
    };
}
/**
 * Parses the text body returned by the server from a batch request
 *
 * @param body String body from the server response
 * @returns Parsed response objects
 */
function parseResponse(body) {
    const responses = [];
    const header = "--batchresponse_";
    // Ex. "HTTP/1.1 500 Internal Server Error"
    const statusRegExp = new RegExp("^HTTP/[0-9.]+ +([0-9]+) +(.*)", "i");
    const lines = body.split("\n");
    let state = "batch";
    let status;
    let statusText;
    let headers = {};
    const bodyReader = [];
    for (let i = 0; i < lines.length; ++i) {
        let line = lines[i];
        switch (state) {
            case "batch":
                if (line.substring(0, header.length) === header) {
                    state = "batchHeaders";
                }
                else {
                    if (line.trim() !== "") {
                        throw Error(`Invalid response, line ${i}`);
                    }
                }
                break;
            case "batchHeaders":
                if (line.trim() === "") {
                    state = "status";
                }
                break;
            case "status": {
                const parts = statusRegExp.exec(line);
                if (parts.length !== 3) {
                    throw Error(`Invalid status, line ${i}`);
                }
                status = parseInt(parts[1], 10);
                statusText = parts[2];
                state = "statusHeaders";
                break;
            }
            case "statusHeaders":
                if (line.trim() === "") {
                    state = "body";
                }
                else {
                    const headerParts = line.split(":");
                    if ((headerParts === null || headerParts === void 0 ? void 0 : headerParts.length) === 2) {
                        headers[headerParts[0].trim()] = headerParts[1].trim();
                    }
                }
                break;
            case "body":
                // reset the body reader
                bodyReader.length = 0;
                // this allows us to capture batch bodies that are returned as multi-line (renderListDataAsStream, #2454)
                while (line.substring(0, header.length) !== header) {
                    bodyReader.push(line);
                    line = lines[++i];
                }
                // because we have read the closing --batchresponse_ line, we need to move the line pointer back one
                // so that the logic works as expected either to get the next result or end processing
                i--;
                responses.push(new Response(status === 204 ? null : bodyReader.join(""), { status, statusText, headers }));
                state = "batch";
                headers = {};
                break;
        }
    }
    if (state !== "status") {
        throw Error("Unexpected end of input");
    }
    return responses;
}
//# sourceMappingURL=batching.js.map

/***/ }),

/***/ "pncs":
/*!***********************************************************************************************************!*\
  !*** ./node_modules/@microsoft/spfx-heft-plugins/node_modules/@microsoft/load-themed-styles/lib/index.js ***!
  \***********************************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitStyles = exports.detokenize = exports.clearStyles = exports.loadTheme = exports.flush = exports.configureRunMode = exports.configureLoadStyles = exports.loadStyles = void 0;
// Store the theming state in __themeState__ global scope for reuse in the case of duplicate
// load-themed-styles hosted on the page.
var _root = typeof window === 'undefined' ? global : window; // eslint-disable-line @typescript-eslint/no-explicit-any
// Nonce string to inject into script tag if one provided. This is used in CSP (Content Security Policy).
var _styleNonce = _root && _root.CSPSettings && _root.CSPSettings.nonce;
var _themeState = initializeThemeState();
/**
 * Matches theming tokens. For example, "[theme: themeSlotName, default: #FFF]" (including the quotes).
 */
var _themeTokenRegex = /[\'\"]\[theme:\s*(\w+)\s*(?:\,\s*default:\s*([\\"\']?[\.\,\(\)\#\-\s\w]*[\.\,\(\)\#\-\w][\"\']?))?\s*\][\'\"]/g;
var now = function () {
    return typeof performance !== 'undefined' && !!performance.now ? performance.now() : Date.now();
};
function measure(func) {
    var start = now();
    func();
    var end = now();
    _themeState.perf.duration += end - start;
}
/**
 * initialize global state object
 */
function initializeThemeState() {
    var state = _root.__themeState__ || {
        theme: undefined,
        lastStyleElement: undefined,
        registeredStyles: []
    };
    if (!state.runState) {
        state = __assign(__assign({}, state), { perf: {
                count: 0,
                duration: 0
            }, runState: {
                flushTimer: 0,
                mode: 0 /* Mode.sync */,
                buffer: []
            } });
    }
    if (!state.registeredThemableStyles) {
        state = __assign(__assign({}, state), { registeredThemableStyles: [] });
    }
    _root.__themeState__ = state;
    return state;
}
/**
 * Loads a set of style text. If it is registered too early, we will register it when the window.load
 * event is fired.
 * @param {string | ThemableArray} styles Themable style text to register.
 * @param {boolean} loadAsync When true, always load styles in async mode, irrespective of current sync mode.
 */
function loadStyles(styles, loadAsync) {
    if (loadAsync === void 0) { loadAsync = false; }
    measure(function () {
        var styleParts = Array.isArray(styles) ? styles : splitStyles(styles);
        var _a = _themeState.runState, mode = _a.mode, buffer = _a.buffer, flushTimer = _a.flushTimer;
        if (loadAsync || mode === 1 /* Mode.async */) {
            buffer.push(styleParts);
            if (!flushTimer) {
                _themeState.runState.flushTimer = asyncLoadStyles();
            }
        }
        else {
            applyThemableStyles(styleParts);
        }
    });
}
exports.loadStyles = loadStyles;
/**
 * Allows for customizable loadStyles logic. e.g. for server side rendering application
 * @param {(processedStyles: string, rawStyles?: string | ThemableArray) => void}
 * a loadStyles callback that gets called when styles are loaded or reloaded
 */
function configureLoadStyles(loadStylesFn) {
    _themeState.loadStyles = loadStylesFn;
}
exports.configureLoadStyles = configureLoadStyles;
/**
 * Configure run mode of load-themable-styles
 * @param mode load-themable-styles run mode, async or sync
 */
function configureRunMode(mode) {
    _themeState.runState.mode = mode;
}
exports.configureRunMode = configureRunMode;
/**
 * external code can call flush to synchronously force processing of currently buffered styles
 */
function flush() {
    measure(function () {
        var styleArrays = _themeState.runState.buffer.slice();
        _themeState.runState.buffer = [];
        var mergedStyleArray = [].concat.apply([], styleArrays);
        if (mergedStyleArray.length > 0) {
            applyThemableStyles(mergedStyleArray);
        }
    });
}
exports.flush = flush;
/**
 * register async loadStyles
 */
function asyncLoadStyles() {
    return setTimeout(function () {
        _themeState.runState.flushTimer = 0;
        flush();
    }, 0);
}
/**
 * Loads a set of style text. If it is registered too early, we will register it when the window.load event
 * is fired.
 * @param {string} styleText Style to register.
 * @param {IStyleRecord} styleRecord Existing style record to re-apply.
 */
function applyThemableStyles(stylesArray, styleRecord) {
    if (_themeState.loadStyles) {
        _themeState.loadStyles(resolveThemableArray(stylesArray).styleString, stylesArray);
    }
    else {
        registerStyles(stylesArray);
    }
}
/**
 * Registers a set theme tokens to find and replace. If styles were already registered, they will be
 * replaced.
 * @param {theme} theme JSON object of theme tokens to values.
 */
function loadTheme(theme) {
    _themeState.theme = theme;
    // reload styles.
    reloadStyles();
}
exports.loadTheme = loadTheme;
/**
 * Clear already registered style elements and style records in theme_State object
 * @param option - specify which group of registered styles should be cleared.
 * Default to be both themable and non-themable styles will be cleared
 */
function clearStyles(option) {
    if (option === void 0) { option = 3 /* ClearStyleOptions.all */; }
    if (option === 3 /* ClearStyleOptions.all */ || option === 2 /* ClearStyleOptions.onlyNonThemable */) {
        clearStylesInternal(_themeState.registeredStyles);
        _themeState.registeredStyles = [];
    }
    if (option === 3 /* ClearStyleOptions.all */ || option === 1 /* ClearStyleOptions.onlyThemable */) {
        clearStylesInternal(_themeState.registeredThemableStyles);
        _themeState.registeredThemableStyles = [];
    }
}
exports.clearStyles = clearStyles;
function clearStylesInternal(records) {
    records.forEach(function (styleRecord) {
        var styleElement = styleRecord && styleRecord.styleElement;
        if (styleElement && styleElement.parentElement) {
            styleElement.parentElement.removeChild(styleElement);
        }
    });
}
/**
 * Reloads styles.
 */
function reloadStyles() {
    if (_themeState.theme) {
        var themableStyles = [];
        for (var _i = 0, _a = _themeState.registeredThemableStyles; _i < _a.length; _i++) {
            var styleRecord = _a[_i];
            themableStyles.push(styleRecord.themableStyle);
        }
        if (themableStyles.length > 0) {
            clearStyles(1 /* ClearStyleOptions.onlyThemable */);
            applyThemableStyles([].concat.apply([], themableStyles));
        }
    }
}
/**
 * Find theme tokens and replaces them with provided theme values.
 * @param {string} styles Tokenized styles to fix.
 */
function detokenize(styles) {
    if (styles) {
        styles = resolveThemableArray(splitStyles(styles)).styleString;
    }
    return styles;
}
exports.detokenize = detokenize;
/**
 * Resolves ThemingInstruction objects in an array and joins the result into a string.
 * @param {ThemableArray} splitStyleArray ThemableArray to resolve and join.
 */
function resolveThemableArray(splitStyleArray) {
    var theme = _themeState.theme;
    var themable = false;
    // Resolve the array of theming instructions to an array of strings.
    // Then join the array to produce the final CSS string.
    var resolvedArray = (splitStyleArray || []).map(function (currentValue) {
        var themeSlot = currentValue.theme;
        if (themeSlot) {
            themable = true;
            // A theming annotation. Resolve it.
            var themedValue = theme ? theme[themeSlot] : undefined;
            var defaultValue = currentValue.defaultValue || 'inherit';
            // Warn to console if we hit an unthemed value even when themes are provided, but only if "DEBUG" is true.
            // Allow the themedValue to be undefined to explicitly request the default value.
            if (theme &&
                !themedValue &&
                console &&
                !(themeSlot in theme) &&
                "boolean" !== 'undefined' &&
                true) {
                console.warn("Theming value not provided for \"".concat(themeSlot, "\". Falling back to \"").concat(defaultValue, "\"."));
            }
            return themedValue || defaultValue;
        }
        else {
            // A non-themable string. Preserve it.
            return currentValue.rawString;
        }
    });
    return {
        styleString: resolvedArray.join(''),
        themable: themable
    };
}
/**
 * Split tokenized CSS into an array of strings and theme specification objects
 * @param {string} styles Tokenized styles to split.
 */
function splitStyles(styles) {
    var result = [];
    if (styles) {
        var pos = 0; // Current position in styles.
        var tokenMatch = void 0;
        while ((tokenMatch = _themeTokenRegex.exec(styles))) {
            var matchIndex = tokenMatch.index;
            if (matchIndex > pos) {
                result.push({
                    rawString: styles.substring(pos, matchIndex)
                });
            }
            result.push({
                theme: tokenMatch[1],
                defaultValue: tokenMatch[2] // May be undefined
            });
            // index of the first character after the current match
            pos = _themeTokenRegex.lastIndex;
        }
        // Push the rest of the string after the last match.
        result.push({
            rawString: styles.substring(pos)
        });
    }
    return result;
}
exports.splitStyles = splitStyles;
/**
 * Registers a set of style text. If it is registered too early, we will register it when the
 * window.load event is fired.
 * @param {ThemableArray} styleArray Array of IThemingInstruction objects to register.
 * @param {IStyleRecord} styleRecord May specify a style Element to update.
 */
function registerStyles(styleArray) {
    if (typeof document === 'undefined') {
        return;
    }
    var head = document.getElementsByTagName('head')[0];
    var styleElement = document.createElement('style');
    var _a = resolveThemableArray(styleArray), styleString = _a.styleString, themable = _a.themable;
    styleElement.setAttribute('data-load-themed-styles', 'true');
    if (_styleNonce) {
        styleElement.setAttribute('nonce', _styleNonce);
    }
    styleElement.appendChild(document.createTextNode(styleString));
    _themeState.perf.count++;
    head.appendChild(styleElement);
    var ev = document.createEvent('HTMLEvents');
    ev.initEvent('styleinsert', true /* bubbleEvent */, false /* cancelable */);
    ev.args = {
        newStyle: styleElement
    };
    document.dispatchEvent(ev);
    var record = {
        styleElement: styleElement,
        themableStyle: styleArray
    };
    if (themable) {
        _themeState.registeredThemableStyles.push(record);
    }
    else {
        _themeState.registeredStyles.push(record);
    }
}
//# sourceMappingURL=index.js.map
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../../../webpack/buildin/global.js */ "yLpj")))

/***/ }),

/***/ "qL0N":
/*!**********************************************************************!*\
  !*** ./node_modules/@pnp/queryable/behaviors/caching-pessimistic.js ***!
  \**********************************************************************/
/*! exports provided: CachingPessimisticRefresh */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export CachingPessimisticRefresh */
/* harmony import */ var _pnp_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @pnp/core */ "JC1J");
/* harmony import */ var _queryable_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../queryable.js */ "Ww49");
/* harmony import */ var _caching_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./caching.js */ "VxMn");



/**
 * Pessimistic Caching Behavior
 * Always returns the cached value if one exists but asynchronously executes the call and updates the cache.
 * If a expireFunc is included then the cache update only happens if the cache has expired.
 *
 * @param store Use local or session storage
 * @param keyFactory: a function that returns the key for the cache value, if not provided a default hash of the url will be used
 * @param expireFunc: a function that returns a date of expiration for the cache value, if not provided the cache never expires but is always updated.
 */
function CachingPessimisticRefresh(props) {
    return (instance) => {
        const pre = async function (url, init, result) {
            const [shouldCache, getCachedValue, setCachedValue] = Object(_caching_js__WEBPACK_IMPORTED_MODULE_2__[/* bindCachingCore */ "e"])(url, init, props);
            if (!shouldCache) {
                return [url, init, result];
            }
            const cached = getCachedValue();
            if (Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* objectDefinedNotNull */ "g"])(cached)) {
                // set our result
                result = cached;
                setTimeout(async () => {
                    const q = new _queryable_js__WEBPACK_IMPORTED_MODULE_1__[/* Queryable */ "e"](this);
                    const a = q.on.pre.toArray();
                    q.on.pre.clear();
                    // filter out this pre handler from the original queryable as we don't want to re-run it
                    a.filter(v => v !== pre).map(v => q.on.pre(v));
                    // in this case the init should contain the correct "method"
                    const value = await q(init);
                    setCachedValue(value);
                }, 0);
            }
            else {
                // register the post handler to cache the value as there is not one already in the cache
                // and we need to run this request as normal
                this.on.post(Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* noInherit */ "b"])(async function (url, result) {
                    setCachedValue(result);
                    return [url, result];
                }));
            }
            return [url, init, result];
        };
        instance.on.pre(pre);
        return instance;
    };
}
//# sourceMappingURL=caching-pessimistic.js.map

/***/ }),

/***/ "qNel":
/*!*******************************************************!*\
  !*** ./node_modules/@pnp/core/behaviors/copy-from.js ***!
  \*******************************************************/
/*! exports provided: CopyFrom */
/*! exports used: CopyFrom */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return CopyFrom; });
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util.js */ "NuLX");
/* harmony import */ var _timeline_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../timeline.js */ "4kGv");


/**
 * Behavior that will copy all the observers in the source timeline and apply it to the incoming instance
 *
 * @param source The source instance from which we will copy the observers
 * @param behavior replace = observers are cleared before adding, append preserves any observers already present
 * @param filter If provided filters the moments from which the observers are copied. It should return true for each moment to include.
 * @returns The mutated this
 */
function CopyFrom(source, behavior = "append", filter) {
    return (instance) => {
        return Reflect.apply(copyObservers, instance, [source, behavior, filter]);
    };
}
/**
 * Function with implied this allows us to access protected members
 *
 * @param this The timeline whose observers we will copy
 * @param source The source instance from which we will copy the observers
 * @param behavior replace = observers are cleared before adding, append preserves any observers already present
 * @returns The mutated this
 */
function copyObservers(source, behavior, filter) {
    if (!Object(_util_js__WEBPACK_IMPORTED_MODULE_0__[/* objectDefinedNotNull */ "l"])(source) || !Object(_util_js__WEBPACK_IMPORTED_MODULE_0__[/* objectDefinedNotNull */ "l"])(source.observers)) {
        return this;
    }
    if (!Object(_util_js__WEBPACK_IMPORTED_MODULE_0__[/* isFunc */ "s"])(filter)) {
        filter = () => true;
    }
    const clonedSource = Object(_timeline_js__WEBPACK_IMPORTED_MODULE_1__[/* cloneObserverCollection */ "t"])(source.observers);
    const keys = Object.keys(clonedSource).filter(filter);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const on = this.on[key];
        if (behavior === "replace") {
            on.clear();
        }
        const momentObservers = clonedSource[key];
        momentObservers.forEach(v => on(v));
    }
    return this;
}
//# sourceMappingURL=copy-from.js.map

/***/ }),

/***/ "qZw7":
/*!****************************************************!*\
  !*** ./node_modules/@pnp/sp/behaviors/defaults.js ***!
  \****************************************************/
/*! exports provided: DefaultInit, DefaultHeaders */
/*! exports used: DefaultHeaders, DefaultInit */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "t", function() { return DefaultInit; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return DefaultHeaders; });
/* harmony import */ var _pnp_queryable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @pnp/queryable */ "Ymo3");
/* harmony import */ var _telemetry_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./telemetry.js */ "nikm");


function DefaultInit() {
    return (instance) => {
        instance.on.pre(async (url, init, result) => {
            init.cache = "no-cache";
            init.credentials = "same-origin";
            return [url, init, result];
        });
        instance.using(Object(_telemetry_js__WEBPACK_IMPORTED_MODULE_1__[/* Telemetry */ "e"])(), Object(_pnp_queryable__WEBPACK_IMPORTED_MODULE_0__[/* RejectOnError */ "r"])(), Object(_pnp_queryable__WEBPACK_IMPORTED_MODULE_0__[/* ResolveOnData */ "o"])());
        return instance;
    };
}
function DefaultHeaders() {
    return (instance) => {
        instance
            .using(Object(_pnp_queryable__WEBPACK_IMPORTED_MODULE_0__[/* InjectHeaders */ "n"])({
            "Accept": "application/json",
            "Content-Type": "application/json;charset=utf-8",
        }));
        return instance;
    };
}
//# sourceMappingURL=defaults.js.map

/***/ }),

/***/ "rLnf":
/*!******************************************************************!*\
  !*** ./lib/webparts/auresApp/components/mentor/RequestDetail.js ***!
  \******************************************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "cDcd");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../AuresApp.module.scss */ "sg2l");
/* harmony import */ var _services_interfaces__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../services/interfaces */ "FFPM");
/* harmony import */ var _services_MentoringService__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../services/MentoringService */ "39m/");
/* harmony import */ var _services_NotificationService__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../services/NotificationService */ "PFk9");
/* harmony import */ var _utils_mockData__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../utils/mockData */ "IxoJ");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};






var MOCK_MENTOR_ID = 1;
var RequestDetail = function (_a) {
    var _b, _c;
    var sp = _a.sp, currentUser = _a.currentUser, navigate = _a.navigate, requestId = _a.requestId, hrEmail = _a.hrEmail;
    var _d = react__WEBPACK_IMPORTED_MODULE_0__["useState"](null), request = _d[0], setRequest = _d[1];
    var _e = react__WEBPACK_IMPORTED_MODULE_0__["useState"](true), loading = _e[0], setLoading = _e[1];
    var _f = react__WEBPACK_IMPORTED_MODULE_0__["useState"](false), deciding = _f[0], setDeciding = _f[1];
    var _g = react__WEBPACK_IMPORTED_MODULE_0__["useState"](false), decisionDone = _g[0], setDecisionDone = _g[1];
    react__WEBPACK_IMPORTED_MODULE_0__["useEffect"](function () {
        if (!requestId) {
            navigate('PendingRequests');
            return;
        }
        new _services_MentoringService__WEBPACK_IMPORTED_MODULE_3__[/* MentoringService */ "e"](sp).getRequestById(requestId)
            .then(setRequest)
            .catch(function () {
            var mock = _utils_mockData__WEBPACK_IMPORTED_MODULE_5__[/* MOCK_REQUESTS */ "t"].find(function (r) { return r.Id === requestId; });
            if (mock)
                setRequest(mock);
            else
                navigate('PendingRequests');
        })
            .finally(function () { return setLoading(false); });
    }, [sp, requestId]);
    var handleDecision = function (decision) { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!request || !myStage)
                        return [2 /*return*/];
                    setDeciding(true);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, new _services_MentoringService__WEBPACK_IMPORTED_MODULE_3__[/* MentoringService */ "e"](sp).makeDecision(request.Id, myStage, decision, currentUser.id)];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = _b.sent();
                    return [3 /*break*/, 4];
                case 4:
                    // 6.2 / 6.3 — notifikace (best-effort, neblokovani UX)
                    void sendDecisionNotification(sp, decision, request, myStage, currentUser, hrEmail);
                    setDecisionDone(true);
                    setDeciding(false);
                    setTimeout(function () { return navigate('PendingRequests'); }, 1200);
                    return [2 /*return*/];
            }
        });
    }); };
    if (loading)
        return react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].loading }, "Na\u010D\u00EDt\u00E1m detail \u017E\u00E1dosti\u2026");
    if (!request)
        return react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].loading }, "\u017D\u00E1dost nenalezena.");
    var mentorId = (_c = (_b = currentUser.mentorRecord) === null || _b === void 0 ? void 0 : _b.Id) !== null && _c !== void 0 ? _c : MOCK_MENTOR_ID;
    var myStage = resolveActiveStage(request, mentorId);
    if (!myStage) {
        return (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].requestDetailCard },
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("p", null, "Tato \u017E\u00E1dost moment\u00E1ln\u011B nevy\u017Eaduje tvoje rozhodnut\u00ED (nen\u00ED ve tv\u00E9 f\u00E1zi, nebo u\u017E byla vy\u0159e\u0161ena)."),
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("button", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].btnSecondary, onClick: function () { return navigate('PendingRequests'); } }, "Zp\u011Bt")));
    }
    var myMessage = myStage === 1 ? request.Message1
        : myStage === 2 ? request.Message2
            : request.Message3;
    var nextMentorHint = resolveNextMentorHint(request, myStage);
    return (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", null,
        react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("button", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].btnBack, onClick: function () { return navigate('PendingRequests'); } }, "\u2039 Zp\u011Bt na seznam"),
        react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("h2", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].pageTitle }, request.Title),
        react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].requestDetailCard },
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].detailSection },
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("p", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].detailLabel }, "Talent"),
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("p", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].detailValue }, request.TalentRef.Title)),
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].detailSection },
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("p", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].detailLabel }, "Tvoje pozice v \u0159et\u011Bzu"),
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("span", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].stageIndicator },
                    "Mentor #",
                    myStage)),
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].detailSection },
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("p", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].detailLabel }, "Zpr\u00E1va od talentu"),
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].talentMessage }, myMessage !== null && myMessage !== void 0 ? myMessage : '(žádná zpráva)')),
            decisionDone ? (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].decisionConfirm }, "Rozhodnut\u00ED ulo\u017Eeno. P\u0159esm\u011Brov\u00E1v\u00E1m\u2026")) : (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].detailSection },
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("p", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].detailLabel }, "Tvoje rozhodnut\u00ED"),
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].decisionBtns },
                    react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("button", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].btnApprove, disabled: deciding, onClick: function () { void handleDecision(_services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* StageDecision */ "t"].Approved); } }, "Schv\u00E1lit"),
                    react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("button", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].btnReject, disabled: deciding, onClick: function () { void handleDecision(_services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* StageDecision */ "t"].Rejected); } }, "Zam\u00EDtnout")),
                nextMentorHint && (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("p", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].rejectHint }, nextMentorHint)))))));
};
// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------
function resolveActiveStage(req, mentorId) {
    var _a, _b, _c;
    if (req.RequestStatus !== _services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* RequestStatus */ "e"].Pending)
        return null;
    if (req.CurrentStage === 1 && ((_a = req.Mentor1Ref) === null || _a === void 0 ? void 0 : _a.Id) === mentorId)
        return 1;
    if (req.CurrentStage === 2 && ((_b = req.Mentor2Ref) === null || _b === void 0 ? void 0 : _b.Id) === mentorId)
        return 2;
    if (req.CurrentStage === 3 && ((_c = req.Mentor3Ref) === null || _c === void 0 ? void 0 : _c.Id) === mentorId)
        return 3;
    return null;
}
function resolveNextMentorHint(req, myStage) {
    if (myStage === 1 && req.Mentor2Ref)
        return "P\u0159i zam\u00EDtnut\u00ED: \u017E\u00E1dost bude p\u0159ed\u00E1na ".concat(req.Mentor2Ref.Title, ".");
    if (myStage === 2 && req.Mentor3Ref)
        return "P\u0159i zam\u00EDtnut\u00ED: \u017E\u00E1dost bude p\u0159ed\u00E1na ".concat(req.Mentor3Ref.Title, ".");
    return 'Při zamítnutí: žádost bude předána na HR review.';
}
// ----------------------------------------------------------------
// 6.2 / 6.3 — Odeslani notifikaci po rozhodnuti (best-effort)
// ----------------------------------------------------------------
function sendDecisionNotification(sp, decision, request, myStage, currentUser, hrEmail) {
    return __awaiter(this, void 0, void 0, function () {
        var svc, ns, talent, nextRef, nextMentor, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 10, , 11]);
                    svc = new _services_MentoringService__WEBPACK_IMPORTED_MODULE_3__[/* MentoringService */ "e"](sp);
                    ns = new _services_NotificationService__WEBPACK_IMPORTED_MODULE_4__[/* NotificationService */ "e"](sp);
                    return [4 /*yield*/, svc.getTalentById(request.TalentRef.Id)];
                case 1:
                    talent = _b.sent();
                    if (!(decision === _services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* StageDecision */ "t"].Approved)) return [3 /*break*/, 4];
                    if (!currentUser.mentorRecord) return [3 /*break*/, 3];
                    return [4 /*yield*/, ns.notifyOnApproval(hrEmail, talent, currentUser.mentorRecord, request.Id, request.Title)];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3: return [3 /*break*/, 9];
                case 4:
                    nextRef = myStage === 1 ? request.Mentor2Ref
                        : myStage === 2 ? request.Mentor3Ref
                            : undefined;
                    if (!nextRef) return [3 /*break*/, 7];
                    return [4 /*yield*/, svc.getMentorById(nextRef.Id)];
                case 5:
                    nextMentor = _b.sent();
                    return [4 /*yield*/, ns.notifyNextMentorOnReject(nextMentor, talent, request.Id, request.Title)];
                case 6:
                    _b.sent();
                    return [3 /*break*/, 9];
                case 7: return [4 /*yield*/, ns.notifyHROnEscalation(hrEmail, talent, request.Id, request.Title)];
                case 8:
                    _b.sent();
                    _b.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    _a = _b.sent();
                    return [3 /*break*/, 11];
                case 11: return [2 /*return*/];
            }
        });
    });
}
/* harmony default export */ __webpack_exports__["e"] = (RequestDetail);


/***/ }),

/***/ "sFlq":
/*!*******************************************************************!*\
  !*** ./lib/webparts/auresApp/components/hr/ApprovedMentorings.js ***!
  \*******************************************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "cDcd");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../AuresApp.module.scss */ "sg2l");
/* harmony import */ var _services_interfaces__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../services/interfaces */ "FFPM");
/* harmony import */ var _services_MentoringService__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../services/MentoringService */ "39m/");
/* harmony import */ var _utils_mockData__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../utils/mockData */ "IxoJ");





var ApprovedMentorings = function (_a) {
    var sp = _a.sp;
    var _b = react__WEBPACK_IMPORTED_MODULE_0__["useState"]([]), requests = _b[0], setRequests = _b[1];
    var _c = react__WEBPACK_IMPORTED_MODULE_0__["useState"](true), loading = _c[0], setLoading = _c[1];
    react__WEBPACK_IMPORTED_MODULE_0__["useEffect"](function () {
        new _services_MentoringService__WEBPACK_IMPORTED_MODULE_3__[/* MentoringService */ "e"](sp).getAllRequests()
            .then(function (all) { return setRequests(all.filter(function (r) {
            return r.RequestStatus === _services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* RequestStatus */ "e"].Approved || r.RequestStatus === _services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* RequestStatus */ "e"].Scheduled;
        })); })
            .catch(function () { return setRequests(_utils_mockData__WEBPACK_IMPORTED_MODULE_4__[/* MOCK_REQUESTS */ "t"].filter(function (r) {
            return r.RequestStatus === _services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* RequestStatus */ "e"].Approved || r.RequestStatus === _services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* RequestStatus */ "e"].Scheduled;
        })); })
            .finally(function () { return setLoading(false); });
    }, [sp]);
    if (loading)
        return react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].loading }, "Na\u010D\u00EDt\u00E1m domluven\u00E9 mentoringy\u2026");
    var getApprovedMentor = function (req) {
        if (req.Stage1Decision === _services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* StageDecision */ "t"].Approved)
            return req.Mentor1Ref;
        if (req.Stage2Decision === _services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* StageDecision */ "t"].Approved)
            return req.Mentor2Ref;
        if (req.Stage3Decision === _services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* StageDecision */ "t"].Approved)
            return req.Mentor3Ref;
        return undefined;
    };
    return (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", null,
        react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("h2", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].pageTitle },
            "Domluven\u00E9 mentoringy (",
            requests.length,
            ")"),
        react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("p", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].sectionHint }, "P\u0159ehled schv\u00E1len\u00FDch mentorsk\u00FDch p\u00E1r\u016F. Dal\u0161\u00ED koordinaci \u0159e\u0161\u00ED HR mimo syst\u00E9m."),
        requests.length === 0 ? (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].emptyState },
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("p", null, "Zat\u00EDm nejsou \u017E\u00E1dn\u00E9 domluven\u00E9 mentoringy."))) : (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].requestList }, requests.map(function (req) {
            var _a;
            var mentor = getApprovedMentor(req);
            return (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { key: req.Id, className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].approvedPairRow },
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].approvedPairInfo },
                    react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("span", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].approvedPairTalent }, req.TalentRef.Title),
                    react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("span", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].approvedPairArrow }, "\u2194"),
                    react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("span", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].approvedPairMentor }, (_a = mentor === null || mentor === void 0 ? void 0 : mentor.Title) !== null && _a !== void 0 ? _a : '—')),
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("span", { className: [
                        _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].statusBadge,
                        req.RequestStatus === _services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* RequestStatus */ "e"].Scheduled ? _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].statusScheduled : _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].statusApproved
                    ].join(' ') }, req.RequestStatus === _services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* RequestStatus */ "e"].Scheduled ? 'Naplánováno' : 'Schváleno')));
        })))));
};
/* harmony default export */ __webpack_exports__["e"] = (ApprovedMentorings);


/***/ }),

/***/ "sg2l":
/*!******************************************************************!*\
  !*** ./lib/webparts/auresApp/components/AuresApp.module.scss.js ***!
  \******************************************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* tslint:disable */
__webpack_require__(/*! ./AuresApp.module.css */ "i1YX");
var styles = {
    auresApp: 'auresApp_3b2f6a0d',
    appShell: 'appShell_3b2f6a0d',
    header: 'header_3b2f6a0d',
    headerLeft: 'headerLeft_3b2f6a0d',
    headerLogo: 'headerLogo_3b2f6a0d',
    headerTitle: 'headerTitle_3b2f6a0d',
    headerTitleAccent: 'headerTitleAccent_3b2f6a0d',
    headerUser: 'headerUser_3b2f6a0d',
    roleSwitch: 'roleSwitch_3b2f6a0d',
    roleBtn: 'roleBtn_3b2f6a0d',
    roleBtnActive: 'roleBtnActive_3b2f6a0d',
    nav: 'nav_3b2f6a0d',
    navTab: 'navTab_3b2f6a0d',
    navTabActive: 'navTabActive_3b2f6a0d',
    navBadge: 'navBadge_3b2f6a0d',
    fadeUp: 'fadeUp_3b2f6a0d',
    content: 'content_3b2f6a0d',
    fadeIn: 'fadeIn_3b2f6a0d',
    accessDenied: 'accessDenied_3b2f6a0d',
    accessDeniedIcon: 'accessDeniedIcon_3b2f6a0d',
    pageTitle: 'pageTitle_3b2f6a0d',
    pageHeader: 'pageHeader_3b2f6a0d',
    loading: 'loading_3b2f6a0d',
    spin: 'spin_3b2f6a0d',
    emptyState: 'emptyState_3b2f6a0d',
    sectionHint: 'sectionHint_3b2f6a0d',
    btnPrimary: 'btnPrimary_3b2f6a0d',
    btnSecondary: 'btnSecondary_3b2f6a0d',
    btnBack: 'btnBack_3b2f6a0d',
    btnApprove: 'btnApprove_3b2f6a0d',
    btnReject: 'btnReject_3b2f6a0d',
    mentorGrid: 'mentorGrid_3b2f6a0d',
    mentorCard: 'mentorCard_3b2f6a0d',
    mentorCardHeader: 'mentorCardHeader_3b2f6a0d',
    mentorAvatar: 'mentorAvatar_3b2f6a0d',
    mentorName: 'mentorName_3b2f6a0d',
    mentorJobTitle: 'mentorJobTitle_3b2f6a0d',
    mentorCapacity: 'mentorCapacity_3b2f6a0d',
    mentorCapacityFull: 'mentorCapacityFull_3b2f6a0d',
    mentorSuperpower: 'mentorSuperpower_3b2f6a0d',
    mentorAvatarPhoto: 'mentorAvatarPhoto_3b2f6a0d',
    mentorBio: 'mentorBio_3b2f6a0d',
    mentorDetails: 'mentorDetails_3b2f6a0d',
    mentorDetailsToggle: 'mentorDetailsToggle_3b2f6a0d',
    mentorDetailsContent: 'mentorDetailsContent_3b2f6a0d',
    mentorChallenge: 'mentorChallenge_3b2f6a0d',
    mentorAvailability: 'mentorAvailability_3b2f6a0d',
    mentorCardActions: 'mentorCardActions_3b2f6a0d',
    requestForm: 'requestForm_3b2f6a0d',
    formSection: 'formSection_3b2f6a0d',
    formSectionTitle: 'formSectionTitle_3b2f6a0d',
    mentorSelectList: 'mentorSelectList_3b2f6a0d',
    mentorSelectItem: 'mentorSelectItem_3b2f6a0d',
    mentorSelectItemChecked: 'mentorSelectItemChecked_3b2f6a0d',
    mentorSelectDisabled: 'mentorSelectDisabled_3b2f6a0d',
    mentorSelectCheckbox: 'mentorSelectCheckbox_3b2f6a0d',
    mentorSelectInfo: 'mentorSelectInfo_3b2f6a0d',
    mentorSelectName: 'mentorSelectName_3b2f6a0d',
    mentorSelectJobTitle: 'mentorSelectJobTitle_3b2f6a0d',
    messageGroup: 'messageGroup_3b2f6a0d',
    messageLabel: 'messageLabel_3b2f6a0d',
    messageTextarea: 'messageTextarea_3b2f6a0d',
    formActions: 'formActions_3b2f6a0d',
    formError: 'formError_3b2f6a0d',
    requestList: 'requestList_3b2f6a0d',
    requestCard: 'requestCard_3b2f6a0d',
    requestCardHeader: 'requestCardHeader_3b2f6a0d',
    requestTitle: 'requestTitle_3b2f6a0d',
    statusBadge: 'statusBadge_3b2f6a0d',
    statusPending: 'statusPending_3b2f6a0d',
    statusApproved: 'statusApproved_3b2f6a0d',
    statusHR: 'statusHR_3b2f6a0d',
    statusScheduled: 'statusScheduled_3b2f6a0d',
    statusCancelled: 'statusCancelled_3b2f6a0d',
    requestMentors: 'requestMentors_3b2f6a0d',
    mentorTag: 'mentorTag_3b2f6a0d',
    mentorTagCurrent: 'mentorTagCurrent_3b2f6a0d',
    mentorTagApproved: 'mentorTagApproved_3b2f6a0d',
    mentorTagRejected: 'mentorTagRejected_3b2f6a0d',
    pendingRow: 'pendingRow_3b2f6a0d',
    pendingRowLeft: 'pendingRowLeft_3b2f6a0d',
    pendingRowHeader: 'pendingRowHeader_3b2f6a0d',
    stageIndicator: 'stageIndicator_3b2f6a0d',
    talentName: 'talentName_3b2f6a0d',
    messagePreview: 'messagePreview_3b2f6a0d',
    arrowIcon: 'arrowIcon_3b2f6a0d',
    requestDetailCard: 'requestDetailCard_3b2f6a0d',
    detailSection: 'detailSection_3b2f6a0d',
    detailLabel: 'detailLabel_3b2f6a0d',
    detailValue: 'detailValue_3b2f6a0d',
    talentMessage: 'talentMessage_3b2f6a0d',
    decisionBtns: 'decisionBtns_3b2f6a0d',
    rejectHint: 'rejectHint_3b2f6a0d',
    decisionConfirm: 'decisionConfirm_3b2f6a0d',
    historyCard: 'historyCard_3b2f6a0d',
    historyLeft: 'historyLeft_3b2f6a0d',
    historyTitle: 'historyTitle_3b2f6a0d',
    historyMeta: 'historyMeta_3b2f6a0d',
    decisionBadge: 'decisionBadge_3b2f6a0d',
    decisionApproved: 'decisionApproved_3b2f6a0d',
    decisionRejected: 'decisionRejected_3b2f6a0d',
    filterRow: 'filterRow_3b2f6a0d',
    filterBar: 'filterBar_3b2f6a0d',
    filterBtn: 'filterBtn_3b2f6a0d',
    filterBtnActive: 'filterBtnActive_3b2f6a0d',
    searchInput: 'searchInput_3b2f6a0d',
    allRequestRow: 'allRequestRow_3b2f6a0d',
    allRequestMain: 'allRequestMain_3b2f6a0d',
    allRequestMeta: 'allRequestMeta_3b2f6a0d',
    hrReviewCard: 'hrReviewCard_3b2f6a0d',
    hrReviewHeader: 'hrReviewHeader_3b2f6a0d',
    hrActionsBar: 'hrActionsBar_3b2f6a0d',
    managementList: 'managementList_3b2f6a0d',
    managementRow: 'managementRow_3b2f6a0d',
    managementRowInactive: 'managementRowInactive_3b2f6a0d',
    managementInfo: 'managementInfo_3b2f6a0d',
    managementName: 'managementName_3b2f6a0d',
    managementMeta: 'managementMeta_3b2f6a0d',
    managementCapacity: 'managementCapacity_3b2f6a0d',
    capacityEdit: 'capacityEdit_3b2f6a0d',
    inlineEditGroup: 'inlineEditGroup_3b2f6a0d',
    inlineInput: 'inlineInput_3b2f6a0d',
    inlineSave: 'inlineSave_3b2f6a0d',
    inlineCancel: 'inlineCancel_3b2f6a0d',
    activeBtn: 'activeBtn_3b2f6a0d',
    inactiveBtn: 'inactiveBtn_3b2f6a0d',
    capacityList: 'capacityList_3b2f6a0d',
    capacityRow: 'capacityRow_3b2f6a0d',
    capacityMentorInfo: 'capacityMentorInfo_3b2f6a0d',
    capacityStats: 'capacityStats_3b2f6a0d',
    capacityStat: 'capacityStat_3b2f6a0d',
    capacityRemaining: 'capacityRemaining_3b2f6a0d',
    capacityFull: 'capacityFull_3b2f6a0d',
    capacityBarWrap: 'capacityBarWrap_3b2f6a0d',
    capacityBarFill: 'capacityBarFill_3b2f6a0d',
    barOk: 'barOk_3b2f6a0d',
    barHigh: 'barHigh_3b2f6a0d',
    barFull: 'barFull_3b2f6a0d',
    primaryMentorCard: 'primaryMentorCard_3b2f6a0d',
    primaryMentorHeader: 'primaryMentorHeader_3b2f6a0d',
    primaryMentorAvatar: 'primaryMentorAvatar_3b2f6a0d',
    primaryMentorInfo: 'primaryMentorInfo_3b2f6a0d',
    primaryMentorName: 'primaryMentorName_3b2f6a0d',
    primaryMentorJobTitle: 'primaryMentorJobTitle_3b2f6a0d',
    primaryMentorSuperpower: 'primaryMentorSuperpower_3b2f6a0d',
    primaryMentorBadge: 'primaryMentorBadge_3b2f6a0d',
    primaryMentorBio: 'primaryMentorBio_3b2f6a0d',
    formSectionHint: 'formSectionHint_3b2f6a0d',
    backupMentorList: 'backupMentorList_3b2f6a0d',
    backupMentorRow: 'backupMentorRow_3b2f6a0d',
    backupMentorRowSelected: 'backupMentorRowSelected_3b2f6a0d',
    backupMentorInfo: 'backupMentorInfo_3b2f6a0d',
    backupMentorActions: 'backupMentorActions_3b2f6a0d',
    backupMentorLabel: 'backupMentorLabel_3b2f6a0d',
    backupMentorLabelTertiary: 'backupMentorLabelTertiary_3b2f6a0d',
    myRequestMentorRow: 'myRequestMentorRow_3b2f6a0d',
    myRequestMentorName: 'myRequestMentorName_3b2f6a0d',
    statusQueued: 'statusQueued_3b2f6a0d',
    resetChoiceCard: 'resetChoiceCard_3b2f6a0d',
    resetChoiceText: 'resetChoiceText_3b2f6a0d',
    resetChoiceWarning: 'resetChoiceWarning_3b2f6a0d',
    hrRequestRow: 'hrRequestRow_3b2f6a0d',
    hrRequestMain: 'hrRequestMain_3b2f6a0d',
    hrRequestNames: 'hrRequestNames_3b2f6a0d',
    hrRequestTalent: 'hrRequestTalent_3b2f6a0d',
    hrRequestArrow: 'hrRequestArrow_3b2f6a0d',
    hrRequestMentor: 'hrRequestMentor_3b2f6a0d',
    hrRequestActions: 'hrRequestActions_3b2f6a0d',
    hrActionBtn: 'hrActionBtn_3b2f6a0d',
    hrActionBtnDanger: 'hrActionBtnDanger_3b2f6a0d',
    approvedPairRow: 'approvedPairRow_3b2f6a0d',
    approvedPairInfo: 'approvedPairInfo_3b2f6a0d',
    approvedPairTalent: 'approvedPairTalent_3b2f6a0d',
    approvedPairArrow: 'approvedPairArrow_3b2f6a0d',
    approvedPairMentor: 'approvedPairMentor_3b2f6a0d',
    mentorFormCard: 'mentorFormCard_3b2f6a0d',
    mentorFormGrid: 'mentorFormGrid_3b2f6a0d',
    mentorFormField: 'mentorFormField_3b2f6a0d',
    mentorFormFieldFull: 'mentorFormFieldFull_3b2f6a0d',
    formInput: 'formInput_3b2f6a0d',
    managementCapacityLabel: 'managementCapacityLabel_3b2f6a0d',
    deleteConfirm: 'deleteConfirm_3b2f6a0d',
    deleteConfirmText: 'deleteConfirmText_3b2f6a0d',
    shimmer: 'shimmer_3b2f6a0d',
    pulseGold: 'pulseGold_3b2f6a0d',
    slideInRight: 'slideInRight_3b2f6a0d'
};
/* harmony default export */ __webpack_exports__["e"] = (styles);
/* tslint:enable */ 


/***/ }),

/***/ "tCQJ":
/*!***************************************!*\
  !*** ./node_modules/@pnp/sp/types.js ***!
  \***************************************/
/*! exports provided: emptyGuid, PrincipalType, PrincipalSource, PageType */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export emptyGuid */
/* unused harmony export PrincipalType */
/* unused harmony export PrincipalSource */
/* unused harmony export PageType */
// reference: https://msdn.microsoft.com/en-us/library/office/dn600183.aspx
const emptyGuid = "00000000-0000-0000-0000-000000000000";
/**
 * Specifies the type of a principal.
 */
var PrincipalType;
(function (PrincipalType) {
    /**
     * Enumeration whose value specifies no principal type.
     */
    PrincipalType[PrincipalType["None"] = 0] = "None";
    /**
     * Enumeration whose value specifies a user as the principal type.
     */
    PrincipalType[PrincipalType["User"] = 1] = "User";
    /**
     * Enumeration whose value specifies a distribution list as the principal type.
     */
    PrincipalType[PrincipalType["DistributionList"] = 2] = "DistributionList";
    /**
     * Enumeration whose value specifies a security group as the principal type.
     */
    PrincipalType[PrincipalType["SecurityGroup"] = 4] = "SecurityGroup";
    /**
     * Enumeration whose value specifies a group as the principal type.
     */
    PrincipalType[PrincipalType["SharePointGroup"] = 8] = "SharePointGroup";
    /**
     * Enumeration whose value specifies all principal types.
     */
    // eslint-disable-next-line no-bitwise
    PrincipalType[PrincipalType["All"] = 15] = "All";
})(PrincipalType || (PrincipalType = {}));
/**
 * Specifies the source of a principal.
 */
var PrincipalSource;
(function (PrincipalSource) {
    /**
     * Enumeration whose value specifies no principal source.
     */
    PrincipalSource[PrincipalSource["None"] = 0] = "None";
    /**
     * Enumeration whose value specifies user information list as the principal source.
     */
    PrincipalSource[PrincipalSource["UserInfoList"] = 1] = "UserInfoList";
    /**
     * Enumeration whose value specifies Active Directory as the principal source.
     */
    PrincipalSource[PrincipalSource["Windows"] = 2] = "Windows";
    /**
     * Enumeration whose value specifies the current membership provider as the principal source.
     */
    PrincipalSource[PrincipalSource["MembershipProvider"] = 4] = "MembershipProvider";
    /**
     * Enumeration whose value specifies the current role provider as the principal source.
     */
    PrincipalSource[PrincipalSource["RoleProvider"] = 8] = "RoleProvider";
    /**
     * Enumeration whose value specifies all principal sources.
     */
    // eslint-disable-next-line no-bitwise
    PrincipalSource[PrincipalSource["All"] = 15] = "All";
})(PrincipalSource || (PrincipalSource = {}));
var PageType;
(function (PageType) {
    PageType[PageType["Invalid"] = -1] = "Invalid";
    PageType[PageType["DefaultView"] = 0] = "DefaultView";
    PageType[PageType["NormalView"] = 1] = "NormalView";
    PageType[PageType["DialogView"] = 2] = "DialogView";
    PageType[PageType["View"] = 3] = "View";
    PageType[PageType["DisplayForm"] = 4] = "DisplayForm";
    PageType[PageType["DisplayFormDialog"] = 5] = "DisplayFormDialog";
    PageType[PageType["EditForm"] = 6] = "EditForm";
    PageType[PageType["EditFormDialog"] = 7] = "EditFormDialog";
    PageType[PageType["NewForm"] = 8] = "NewForm";
    PageType[PageType["NewFormDialog"] = 9] = "NewFormDialog";
    PageType[PageType["SolutionForm"] = 10] = "SolutionForm";
    PageType[PageType["PAGE_MAXITEMS"] = 11] = "PAGE_MAXITEMS";
})(PageType || (PageType = {}));
//# sourceMappingURL=types.js.map

/***/ }),

/***/ "tGZ3":
/*!************************************************************!*\
  !*** ./node_modules/@pnp/queryable/behaviors/resolvers.js ***!
  \************************************************************/
/*! exports provided: ResolveOnData, RejectOnError */
/*! exports used: RejectOnError, ResolveOnData */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "t", function() { return ResolveOnData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return RejectOnError; });
function ResolveOnData() {
    return (instance) => {
        instance.on.data(function (data) {
            this.emit[this.InternalResolve](data);
        });
        return instance;
    };
}
function RejectOnError() {
    return (instance) => {
        instance.on.error(function (err) {
            this.emit[this.InternalReject](err);
        });
        return instance;
    };
}
//# sourceMappingURL=resolvers.js.map

/***/ }),

/***/ "udT0":
/*!**********************************************************!*\
  !*** ./node_modules/@pnp/queryable/behaviors/parsers.js ***!
  \**********************************************************/
/*! exports provided: DefaultParse, TextParse, BlobParse, JSONParse, BufferParse, HeaderParse, JSONHeaderParse, errorCheck, parseODataJSON, parseBinderWithErrorCheck, HttpRequestError */
/*! exports used: DefaultParse, HttpRequestError, JSONParse, TextParse, parseBinderWithErrorCheck, parseODataJSON */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return DefaultParse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TextParse; });
/* unused harmony export BlobParse */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return JSONParse; });
/* unused harmony export BufferParse */
/* unused harmony export HeaderParse */
/* unused harmony export JSONHeaderParse */
/* unused harmony export errorCheck */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "r", function() { return parseODataJSON; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return parseBinderWithErrorCheck; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "t", function() { return HttpRequestError; });
/* harmony import */ var _pnp_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @pnp/core */ "JC1J");


function DefaultParse() {
    return parseBinderWithErrorCheck(async (response) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if ((response.headers.has("Content-Length") && parseFloat(response.headers.get("Content-Length")) === 0) || response.status === 204) {
            return {};
        }
        // patch to handle cases of 200 response with no or whitespace only bodies (#487 & #545)
        const txt = await response.text();
        const json = txt.replace(/\s/ig, "").length > 0 ? JSON.parse(txt) : {};
        return parseODataJSON(json);
    });
}
function TextParse() {
    return parseBinderWithErrorCheck(r => r.text());
}
function BlobParse() {
    return parseBinderWithErrorCheck(r => r.blob());
}
function JSONParse() {
    return parseBinderWithErrorCheck(r => r.json());
}
function BufferParse() {
    return parseBinderWithErrorCheck(r => Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* isFunc */ "p"])(r.arrayBuffer) ? r.arrayBuffer() : r.buffer());
}
function HeaderParse() {
    return parseBinderWithErrorCheck(async (r) => r.headers);
}
function JSONHeaderParse() {
    return parseBinderWithErrorCheck(async (response) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (response.status === 204) {
            return {};
        }
        // patch to handle cases of 200 response with no or whitespace only bodies (#487 & #545)
        const txt = await response.text();
        const json = txt.replace(/\s/ig, "").length > 0 ? JSON.parse(txt) : {};
        return { data: { ...parseODataJSON(json) }, headers: response.headers };
    });
}
async function errorCheck(url, response, result) {
    if (!response.ok) {
        throw await HttpRequestError.init(response);
    }
    return [url, response, result];
}
function parseODataJSON(json) {
    let result = json;
    if (Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* hOP */ "u"])(json, "d")) {
        if (Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* hOP */ "u"])(json.d, "results")) {
            result = json.d.results;
        }
        else {
            result = json.d;
        }
    }
    else if (Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* hOP */ "u"])(json, "value")) {
        result = json.value;
    }
    return result;
}
/**
 * Provides a clean way to create new parse bindings without having to duplicate a lot of boilerplate
 * Includes errorCheck ahead of the supplied impl
 *
 * @param impl Method used to parse the response
 * @returns Queryable behavior binding function
 */
function parseBinderWithErrorCheck(impl) {
    return (instance) => {
        // we clear anything else registered for parse
        // add error check
        // add the impl function we are supplied
        instance.on.parse.replace(errorCheck);
        instance.on.parse(async (url, response, result) => {
            if (response.ok && typeof result === "undefined") {
                result = await impl(response);
            }
            return [url, response, result];
        });
        return instance;
    };
}
class HttpRequestError extends Error {
    constructor(message, response, status = response.status, statusText = response.statusText) {
        super(message);
        this.response = response;
        this.status = status;
        this.statusText = statusText;
        this.isHttpRequestError = true;
    }
    static async init(r) {
        const t = await r.clone().text();
        return new HttpRequestError(`Error making HttpClient request in queryable [${r.status}] ${r.statusText} ::> ${t}`, r);
    }
}
//# sourceMappingURL=parsers.js.map

/***/ }),

/***/ "v6VW":
/*!************************************!*\
  !*** ./node_modules/@pnp/sp/fi.js ***!
  \************************************/
/*! exports provided: SPFI, spfi */
/*! exports used: SPFI, spfi */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return SPFI; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "t", function() { return spfi; });
/* harmony import */ var _spqueryable_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./spqueryable.js */ "F4qD");

class SPFI {
    /**
     * Creates a new instance of the SPFI class
     *
     * @param root Establishes a root url/configuration
     */
    constructor(root = "") {
        this._root = Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_0__[/* SPQueryable */ "n"])(root);
    }
    /**
     * Applies one or more behaviors which will be inherited by all instances chained from this root
     *
     */
    using(...behaviors) {
        this._root.using(...behaviors);
        return this;
    }
    /**
     * Used by extending classes to create new objects directly from the root
     *
     * @param factory The factory for the type of object to create
     * @returns A configured instance of that object
     */
    create(factory, path) {
        return factory(this._root, path);
    }
}
function spfi(root = "") {
    if (typeof root === "object" && !Reflect.has(root, "length")) {
        root = root._root;
    }
    return new SPFI(root);
}
//# sourceMappingURL=fi.js.map

/***/ }),

/***/ "vbtm":
/*!*******************************************************!*\
  !*** ./node_modules/@pnp/sp/utils/encode-path-str.js ***!
  \*******************************************************/
/*! exports provided: encodePath, encodePathNoURIEncode */
/*! exports used: encodePath */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return encodePath; });
/* unused harmony export encodePathNoURIEncode */
/* harmony import */ var _pnp_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @pnp/core */ "JC1J");

/**
 * Encodes path portions of SharePoint urls such as decodedUrl=`encodePath(pathStr)`
 *
 * @param value The string path to encode
 * @returns A path encoded for use in SP urls
 */
function encodePath(value) {
    if (Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* stringIsNullOrEmpty */ "S"])(value)) {
        return "";
    }
    // replace all instance of ' with ''
    if (/!(@.*?)::(.*?)/ig.test(value)) {
        return value.replace(/!(@.*?)::(.*)$/ig, (match, labelName, v) => {
            // we do not need to encodeURIComponent v as it will be encoded automatically when it is added as a query string param
            // we do need to double any ' chars
            return `!${labelName}::${v.replace(/'/ig, "''")}`;
        });
    }
    else {
        // because this is a literal path value we encodeURIComponent after doubling any ' chars
        return encodeURIComponent(value.replace(/'/ig, "''"));
    }
}
function encodePathNoURIEncode(value) {
    if (Object(_pnp_core__WEBPACK_IMPORTED_MODULE_0__[/* stringIsNullOrEmpty */ "S"])(value)) {
        return "";
    }
    // replace all instance of ' with ''
    if (/!(@.*?)::(.*?)/ig.test(value)) {
        return value.replace(/!(@.*?)::(.*)$/ig, (match, labelName, v) => {
            // we do not need to encodeURIComponent v as it will be encoded automatically when it is added as a query string param
            // we do need to double any ' chars
            return `!${labelName}::${v.replace(/'/ig, "''")}`;
        });
    }
    else {
        // because this is a literal path value we encodeURIComponent after doubling any ' chars
        return value.replace(/'/ig, "''");
    }
}
//# sourceMappingURL=encode-path-str.js.map

/***/ }),

/***/ "y+KB":
/*!**************************************************!*\
  !*** ./node_modules/@pnp/sp/site-users/types.js ***!
  \**************************************************/
/*! exports provided: _SiteUsers, SiteUsers, _SiteUser, SiteUser */
/*! exports used: SiteUser, SiteUsers */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export _SiteUsers */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "t", function() { return SiteUsers; });
/* unused harmony export _SiteUser */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return SiteUser; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "LVfT");
/* harmony import */ var _spqueryable_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../spqueryable.js */ "F4qD");
/* harmony import */ var _site_groups_types_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../site-groups/types.js */ "UuUm");
/* harmony import */ var _pnp_queryable__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @pnp/queryable */ "Ymo3");
/* harmony import */ var _decorators_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../decorators.js */ "hMpi");





let _SiteUsers = class _SiteUsers extends _spqueryable_js__WEBPACK_IMPORTED_MODULE_1__[/* _SPCollection */ "a"] {
    /**
     * Gets a user from the collection by id
     *
     * @param id The id of the user to retrieve
     */
    getById(id) {
        return SiteUser(this, `getById(${id})`);
    }
    /**
     * Gets a user from the collection by email
     *
     * @param email The email address of the user to retrieve
     */
    getByEmail(email) {
        return SiteUser(this, `getByEmail('${email}')`);
    }
    /**
     * Gets a user from the collection by login name
     *
     * @param loginName The login name of the user to retrieve
     *   e.g. SharePoint Online: 'i:0#.f|membership|user@domain'
     */
    getByLoginName(loginName) {
        return SiteUser(this).concat(`('!@v::${loginName}')`);
    }
    /**
     * Removes a user from the collection by id
     *
     * @param id The id of the user to remove
     */
    removeById(id) {
        return Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_1__[/* spPost */ "d"])(SiteUsers(this, `removeById(${id})`));
    }
    /**
     * Removes a user from the collection by login name
     *
     * @param loginName The login name of the user to remove
     */
    removeByLoginName(loginName) {
        const o = SiteUsers(this, "removeByLoginName(@v)");
        o.query.set("@v", `'${loginName}'`);
        return Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_1__[/* spPost */ "d"])(o);
    }
    /**
     * Adds a user to a site collection
     *
     * @param loginName The login name of the user to add  to a site collection
     *
     */
    async add(loginName) {
        await Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_1__[/* spPost */ "d"])(this, Object(_pnp_queryable__WEBPACK_IMPORTED_MODULE_3__[/* body */ "d"])({ LoginName: loginName }));
        return this.getByLoginName(loginName);
    }
};
_SiteUsers = Object(tslib__WEBPACK_IMPORTED_MODULE_0__[/* __decorate */ "e"])([
    Object(_decorators_js__WEBPACK_IMPORTED_MODULE_4__[/* defaultPath */ "e"])("siteusers")
], _SiteUsers);

const SiteUsers = Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_1__[/* spInvokableFactory */ "c"])(_SiteUsers);
/**
 * Describes a single user
 *
 */
class _SiteUser extends _spqueryable_js__WEBPACK_IMPORTED_MODULE_1__[/* _SPInstance */ "i"] {
    constructor() {
        super(...arguments);
        this.delete = Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_1__[/* deleteable */ "o"])();
    }
    /**
     * Gets the groups for this user
     *
     */
    get groups() {
        return Object(_site_groups_types_js__WEBPACK_IMPORTED_MODULE_2__[/* SiteGroups */ "e"])(this, "groups");
    }
    /**
     * Updates this user
     *
     * @param props Group properties to update
     */
    async update(props) {
        return Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_1__[/* spPostMerge */ "l"])(this, Object(_pnp_queryable__WEBPACK_IMPORTED_MODULE_3__[/* body */ "d"])(props));
    }
}
const SiteUser = Object(_spqueryable_js__WEBPACK_IMPORTED_MODULE_1__[/* spInvokableFactory */ "c"])(_SiteUser);
//# sourceMappingURL=types.js.map

/***/ }),

/***/ "yLpj":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "zhiF":
/*!*********************************************************!*\
  !*** ./node_modules/@pnp/core/behaviors/assign-from.js ***!
  \*********************************************************/
/*! exports provided: AssignFrom */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export AssignFrom */
/**
 * Behavior that will assign a ref to the source's observers and reset the instance's inheriting flag
 *
 * @param source The source instance from which we will assign the observers
 */
function AssignFrom(source) {
    return (instance) => {
        instance.observers = source.observers;
        instance._inheritingObservers = true;
        return instance;
    };
}
//# sourceMappingURL=assign-from.js.map

/***/ }),

/***/ "zlKG":
/*!******************************************************************!*\
  !*** ./lib/webparts/auresApp/components/hr/CapacityDashboard.js ***!
  \******************************************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "cDcd");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../AuresApp.module.scss */ "sg2l");
/* harmony import */ var _services_interfaces__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../services/interfaces */ "FFPM");
/* harmony import */ var _services_MentoringService__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../services/MentoringService */ "39m/");
/* harmony import */ var _utils_mockData__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../utils/mockData */ "IxoJ");





var CapacityDashboard = function (_a) {
    var sp = _a.sp;
    var _b = react__WEBPACK_IMPORTED_MODULE_0__["useState"]([]), mentors = _b[0], setMentors = _b[1];
    var _c = react__WEBPACK_IMPORTED_MODULE_0__["useState"]([]), requests = _c[0], setRequests = _c[1];
    var _d = react__WEBPACK_IMPORTED_MODULE_0__["useState"](true), loading = _d[0], setLoading = _d[1];
    react__WEBPACK_IMPORTED_MODULE_0__["useEffect"](function () {
        var svc = new _services_MentoringService__WEBPACK_IMPORTED_MODULE_3__[/* MentoringService */ "e"](sp);
        Promise.all([svc.getMentors(), svc.getAllRequests()])
            .then(function (_a) {
            var m = _a[0], r = _a[1];
            setMentors(m);
            setRequests(r);
        })
            .catch(function () {
            setMentors(_utils_mockData__WEBPACK_IMPORTED_MODULE_4__[/* MOCK_MENTORS */ "e"].filter(function (m) { return m.IsActive; }));
            setRequests(_utils_mockData__WEBPACK_IMPORTED_MODULE_4__[/* MOCK_REQUESTS */ "t"]);
        })
            .finally(function () { return setLoading(false); });
    }, [sp]);
    if (loading)
        return react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].loading }, "Na\u010D\u00EDt\u00E1m dashboard\u2026");
    return (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", null,
        react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("h2", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].pageTitle }, "Kapacitn\u00ED dashboard"),
        react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].capacityList }, mentors.map(function (mentor) {
            var approved = countApproved(mentor.Id, requests);
            var remaining = Math.max(0, mentor.Capacity - approved);
            var pct = mentor.Capacity > 0
                ? Math.min(100, Math.round((approved / mentor.Capacity) * 100))
                : 100;
            var barClass = pct >= 100 ? _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].barFull : pct >= 75 ? _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].barHigh : _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].barOk;
            return (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { key: mentor.Id, className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].capacityRow },
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].capacityMentorInfo },
                    react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("p", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].managementName }, mentor.Title),
                    react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("p", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].managementMeta }, mentor.JobTitle)),
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].capacityStats },
                    react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("span", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].capacityStat },
                        approved,
                        " / ",
                        mentor.Capacity),
                    react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("span", { className: [
                            _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].capacityRemaining,
                            remaining === 0 ? _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].capacityFull : ''
                        ].filter(Boolean).join(' ') }, remaining > 0 ? "".concat(remaining, " voln\u00FDch") : 'Plno')),
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: _AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].capacityBarWrap },
                    react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: [_AuresApp_module_scss__WEBPACK_IMPORTED_MODULE_1__[/* default */ "e"].capacityBarFill, barClass].join(' '), style: { width: "".concat(pct, "%") } }))));
        }))));
};
function countApproved(mentorId, reqs) {
    return reqs.filter(function (r) {
        var _a, _b, _c;
        return r.RequestStatus === _services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* RequestStatus */ "e"].Approved && ((((_a = r.Mentor1Ref) === null || _a === void 0 ? void 0 : _a.Id) === mentorId && r.Stage1Decision === _services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* StageDecision */ "t"].Approved) ||
            (((_b = r.Mentor2Ref) === null || _b === void 0 ? void 0 : _b.Id) === mentorId && r.Stage2Decision === _services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* StageDecision */ "t"].Approved) ||
            (((_c = r.Mentor3Ref) === null || _c === void 0 ? void 0 : _c.Id) === mentorId && r.Stage3Decision === _services_interfaces__WEBPACK_IMPORTED_MODULE_2__[/* StageDecision */ "t"].Approved));
    }).length;
}
/* harmony default export */ __webpack_exports__["e"] = (CapacityDashboard);


/***/ })

/******/ })});;
//# sourceMappingURL=aures-app-web-part.js.map