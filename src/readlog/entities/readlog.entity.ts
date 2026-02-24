import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Article } from '../../article/entities/article.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Readlog {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ type: 'uuid' })
	articleId: string;

	@ManyToOne(() => Article, { nullable: false, onDelete: 'CASCADE' })
	@JoinColumn({ name: 'articleId' })
	article: Article;

	@Column({ type: 'uuid', nullable: true, default: null })
	readerId: string | null;

	@ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
	@JoinColumn({ name: 'readerId' })
	reader: User | null;

	@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	readAt: Date;
}
