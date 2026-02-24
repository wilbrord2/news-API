import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	Unique,
} from 'typeorm';
import { Article } from '../../article/entities/article.entity';

@Entity('daily_analytics')
@Unique(['articleId', 'date'])
export class Analytics {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ type: 'uuid' })
	articleId: string;

	@ManyToOne(() => Article, { nullable: false, onDelete: 'CASCADE' })
	@JoinColumn({ name: 'articleId' })
	article: Article;

	@Column({ type: 'int', default: 0 })
	viewCount: number;

	@Column({ type: 'date' })
	date: Date;
}
