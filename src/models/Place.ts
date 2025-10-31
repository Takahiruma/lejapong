export class Place {
  id: string;
  name: string;
  city: string;
  district: string;
  activityType: string;
  description: string;
  link: string;
  comment: string;

  constructor({
    id,
    name,
    city,
    district,
    activityType,
    description,
    link,
    comment
  }: {
    id: string;
    name: string;
    city: string;
    district: string;
    activityType: string;
    description: string;
    link: string;
    comment: string;
  }) {
    this.id = id;
    this.name = name;
    this.city = city;
    this.district = district;
    this.activityType = activityType;
    this.description = description;
    this.link = link;
    this.comment = comment;
  }
}
