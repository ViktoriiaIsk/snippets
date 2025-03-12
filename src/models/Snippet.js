"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var SnippetSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    code: { type: String, required: true },
    language: { type: String, required: true },
    tags: { type: [String], default: [] },
    expiresIn: { type: Number, default: null },
    expiresAt: { type: Date, default: null },
}, { timestamps: true });
SnippetSchema.pre('save', function (next) {
    if (this.expiresIn) {
        this.expiresAt = new Date(Date.now() + this.expiresIn * 1000);
    }
    next();
});
SnippetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
var Snippet = mongoose_1.default.model('Snippet', SnippetSchema);
exports.default = Snippet;
