import mongoose, { Schema, Document } from 'mongoose';

interface ISnippet extends Document {
  title: string;
  code: string;
  language: string;
  tags: string[];
  expiresIn?: number;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SnippetSchema = new Schema<ISnippet>(
  {
    title: { type: String, required: true },
    code: { type: String, required: true },
    language: { type: String, required: true },
    tags: { type: [String], default: [] },
    expiresIn: { type: Number, default: null }, 
    expiresAt: { type: Date, default: null },   
  },
  { timestamps: true } 
);


SnippetSchema.pre('save', function (next) {
  if (this.expiresIn) {
    this.expiresAt = new Date(Date.now() + this.expiresIn * 1000); 
  }
  next();
});


SnippetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Snippet = mongoose.model<ISnippet>('Snippet', SnippetSchema);

export default Snippet;
