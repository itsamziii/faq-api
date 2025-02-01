import mongoose, {
    type DeleteResult,
    type GetLeanResultType,
    type Model,
    model,
    Schema,
    type UpdateResult,
} from "mongoose";

export interface IFAQ {
    _id: mongoose.Types.ObjectId;
    question: string; // EN
    answer: string; // EN
    translations: Map<string, { question: string; answer: string }>;
    createdAt: Date;
    updatedAt: Date;
}

export type FAQInput = Omit<IFAQ, "createdAt" | "updatedAt" | "_id">;

export interface FAQTranslated {
    id: string;
    question: string;
    answer: string;
    language: string;
}

interface IFAQMethods {
    getTranslated(lang: string): FAQTranslated;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface FAQModel extends Model<IFAQ, {}, IFAQMethods> {
    add(data: FAQInput): Promise<IFAQ>;
    get(faqId: string): Promise<GetLeanResultType<IFAQ, IFAQ, object> | null>;
    update(faqId: string, data: FAQInput): Promise<UpdateResult>;
    remove(faqId: string): Promise<DeleteResult>;
}

const faqSchema = new Schema<IFAQ, FAQModel, IFAQMethods>(
    {
        question: String,
        answer: String,
        translations: {
            type: Map,
            of: {
                question: String,
                answer: String,
            },
        },
    },
    {
        timestamps: true,
        statics: {
            async add(data: FAQInput) {
                return this.create(data);
            },

            async get(faqId: string) {
                return this.findById(faqId).select("-__v").lean();
            },

            async remove(faqId: string) {
                return this.deleteOne({ _id: faqId });
            },

            async update(faqId: string, data: FAQInput) {
                return this.findByIdAndUpdate(faqId, data, { new: true });
            },
        },
    },
);

faqSchema.method("getTranslated", function (lang: string): FAQTranslated {
    const translation = this.translations.get(lang);

    return {
        id: this._id.toHexString(),
        question: translation?.question ?? this.question,
        answer: translation?.answer ?? this.answer,
        language: translation ? lang : "en",
    };
});

const collectionName = "faqs";

const FAQModel = model<IFAQ, FAQModel>(collectionName, faqSchema);

export { FAQModel };
