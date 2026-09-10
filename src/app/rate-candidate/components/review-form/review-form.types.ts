export type ReviewFormProps = {
  review: string;
  onChangeReview: (value: string) => void;
  maxChars: number;
};
