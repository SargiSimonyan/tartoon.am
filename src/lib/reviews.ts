import type { Localized } from "./portfolio";

export type Review = {
  id: string;
  name: string;
  city: Localized;
  rating: number; // 1..5
  project: Localized;
  text: Localized;
};

export const REVIEWS: Review[] = [
  {
    id: "r1",
    name: "Անի Հ. / Ани А.",
    city: { hy: "Երևան", ru: "Ереван", en: "Yerevan" },
    rating: 5,
    project: {
      hy: "Հանդերձարան",
      ru: "Гардеробная",
      en: "Walk-in wardrobe",
    },
    text: {
      hy: "Հաշվարկից մինչև տեղադրում ամեն ինչ թափանցիկ էր՝ գծագիր, ժամկետ, գին առանց անակնկալների։ Հանդերձարանը ճիշտ մտավ մի քանի միլիմետրի ճշտությամբ։",
      ru: "От расчёта до монтажа всё было прозрачно: чертёж, сроки, цена без сюрпризов. Гардеробная встала миллиметр в миллиметр.",
      en: "From quote to installation everything was transparent — drawing, timeline, price with no surprises. The wardrobe fit to the millimetre.",
    },
  },
  {
    id: "r2",
    name: "Դավիթ Ք. / Давид К.",
    city: { hy: "Երևան", ru: "Ереван", en: "Yerevan" },
    rating: 5,
    project: { hy: "Խոհանոց", ru: "Кухня", en: "Kitchen" },
    text: {
      hy: "3D կոնֆիգուրատորով նախապես տեսանք վերջնական տեսքը, ոչ մի բան չմնաց երևակայությանը։ Որակը՝ գերազանց, ֆուրնիտուրան՝ լուռ ու փափուկ։",
      ru: "Благодаря 3D-конфигуратору увидели итог заранее — ничего не осталось на воображение. Качество отличное, фурнитура тихая и мягкая.",
      en: "The configurator let us see the final look up front — nothing left to imagination. Great quality, quiet soft-close hardware.",
    },
  },
  {
    id: "r3",
    name: "Մարիամ Ս. / Мариам С.",
    city: { hy: "Աբովյան", ru: "Абовян", en: "Abovyan" },
    rating: 5,
    project: {
      hy: "Դարակաշար և TV վահանակ",
      ru: "Стеллаж и ТВ-тумба",
      en: "Shelving & TV unit",
    },
    text: {
      hy: "Ոչ ստանդարտ նախագիծ էր՝ ութանկյուն դարակներ։ Վարպետները չվախեցան բարդությունից, արդյունքը դարձավ սենյակի գլխավոր շեշտը։",
      ru: "Был нестандартный проект — восьмигранные полки. Мастера не испугались сложности, результат стал акцентом комнаты.",
      en: "A non-standard project — octagonal shelves. The team wasn’t put off by the complexity, and the result became the room’s centrepiece.",
    },
  },
  {
    id: "r4",
    name: "Ռուբեն Մ. / Рубен М.",
    city: { hy: "Երևան", ru: "Ереван", en: "Yerevan" },
    rating: 5,
    project: {
      hy: "Ճաշասեղան կաղնուց",
      ru: "Обеденный стол из дуба",
      en: "Oak dining table",
    },
    text: {
      hy: "Կաղնու զանգվածից սեղանը գերազանցեց սպասելիքները։ Հանձնման ժամկետը պահեցին օր առ օր։",
      ru: "Стол из массива дуба превзошёл ожидания. Срок сдачи выдержали день в день.",
      en: "The solid oak table exceeded expectations. They hit the delivery date to the day.",
    },
  },
];

export function averageRating(): number {
  const sum = REVIEWS.reduce((a, r) => a + r.rating, 0);
  return Math.round((sum / REVIEWS.length) * 10) / 10;
}
