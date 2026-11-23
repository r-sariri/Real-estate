export type PropertyType = 'Villa' | 'House' | 'Estate' | 'Penthouse';

export type PropertyImage = {
  id: string;
  alt: string;
};

export type Property = {
  id: string;
  slug: string;
  name: string;
  type: PropertyType;
  price: number;
  city: string;
  region: string;
  country: string;
  beds: number;
  baths: number;
  sqft: number;
  lot: string;
  year: number;
  featured: boolean;
  listedAt: string;
  summary: string;
  description: string[];
  highlights: string[];
  amenities: string[];
  images: PropertyImage[];
  agentId: string;
  neighborhood: {
    intro: string;
    nearby: { label: string; value: string }[];
  };
};

export type Agent = {
  id: string;
  name: string;
  role: string;
  photoId: string;
  phone: string;
  email: string;
  focus: string;
};

export type Service = {
  slug: string;
  title: string;
  description: string;
  imageId: string;
  imageAlt: string;
};

export type InquiryMode = 'contact' | 'viewing';

export type InquiryInput = {
  mode: InquiryMode;
  name: string;
  email: string;
  phone: string;
  message: string;
  propertySlug?: string;
  propertyName?: string;
  preferredDate?: string;
  preferredTime?: string;
};

export type Inquiry = InquiryInput & {
  id: string;
  createdAt: string;
};
