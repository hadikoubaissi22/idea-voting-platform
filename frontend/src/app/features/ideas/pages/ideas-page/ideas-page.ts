import { Component, OnInit, OnDestroy,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IdeasService } from '../../../../core/services/ideas.service';
import { Idea } from '../../../../core/models/idea.model';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { SocketService } from '../../../../core/services/socket.service';
import { Subscription } from 'rxjs';

import { 
  LucideAngularModule, 
  ThumbsUp, 
  ThumbsDown, 
  TrendingUp,
  Clock,
  Sparkles,
  Lightbulb,
  Plus,
  Search,
  Loader2,
  CircleAlertIcon,
  RefreshCw,
  XIcon
} from 'lucide-angular';

@Component({
  standalone: true,
  selector: 'app-ideas-page',
  imports: [CommonModule, LucideAngularModule,ReactiveFormsModule],
  templateUrl: './ideas-page.html',
  styleUrls: ['./ideas-page.css']
})
export class IdeasPage implements OnInit, OnDestroy {
  ideas: Idea[] = [];
  loading = true;
  searchTerm = '';
  filteredIdeas: Idea[] = [];
  processingVotes = new Set<string>();
  isModalOpen = false;
  ideaForm!: FormGroup;
  errorMessage: string | null = null;
  submitting = false;
  votingErrors = new Map<string, string>();
  getVotingError(id: string): string | undefined {
    return this.votingErrors.get(id);
  }

  readonly thumbsUpIcon = ThumbsUp;
  readonly thumbsDownIcon = ThumbsDown;
  readonly trendingUpIcon = TrendingUp;
  readonly clockIcon = Clock;
  readonly sparklesIcon = Sparkles;
  readonly lightbulbIcon = Lightbulb;
  readonly plusIcon = Plus;
  readonly searchIcon = Search;
  readonly loaderIcon = Loader2;
  readonly alertIcon = CircleAlertIcon;
  readonly refreshIcon = RefreshCw;
  readonly xIcon = XIcon;

  private socketSubs: Subscription[] = [];

  constructor(
    private ideasService: IdeasService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private socketService: SocketService,
  ) {}

  private listenToSockets() {
    
    this.socketSubs.push(
      this.socketService.onIdeaUpdated().subscribe((updated: Idea) => {
        
        const index = this.ideas.findIndex(i => i.id === updated.id);
        if (index !== -1) {
          this.ideas[index] = updated;
        }

        this.ideas.sort((a, b) => b.vote_count - a.vote_count);

        if (this.searchTerm) {
          
          this.filteredIdeas = this.ideas.filter(idea =>
            idea.title.toLowerCase().includes(this.searchTerm) ||
            idea.description.toLowerCase().includes(this.searchTerm)
          );
        } else {
        
          this.filteredIdeas = [...this.ideas];
        }
        this.filteredIdeas.sort((a, b) => b.vote_count - a.vote_count);

        this.cdr.detectChanges(); 
      })
    );

    this.socketSubs.push(
      this.socketService.onIdeaAdded().subscribe((newIdea: Idea) => {
        if (!this.ideas.find(i => i.id === newIdea.id)) {
          this.ideas.push(newIdea);

          this.ideas.sort((a, b) => b.vote_count - a.vote_count);

          if (this.searchTerm) {
            this.filteredIdeas = this.ideas.filter(idea =>
              idea.title.toLowerCase().includes(this.searchTerm) ||
              idea.description.toLowerCase().includes(this.searchTerm)
            );
          } else {
            this.filteredIdeas = [...this.ideas];
          }

          this.filteredIdeas.sort((a, b) => b.vote_count - a.vote_count);
          
          this.cdr.detectChanges();
        }
      })
    );
  }


  ngOnInit() {
    this.ideaForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
    });

    this.loadIdeas();
  }

  ngOnDestroy() {
    this.socketSubs.forEach(sub => sub.unsubscribe());
  }

  private stopSockets() {
    this.socketSubs.forEach(sub => sub.unsubscribe());
    this.socketSubs = [];
  }

  loadIdeas() {
    this.loading = true;
    this.errorMessage = null;

    this.ideasService.getIdeas()
      .subscribe({
        next: (res) => {
          this.ideas = res ?? [];
          this.filteredIdeas = [...this.ideas];
          this.loading = false;
          this.listenToSockets();
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
          this.ideas = [];
          this.filteredIdeas = [];
          this.loading = false;
          this.errorMessage = 'Failed to load ideas. Please check your connection.';
          
          this.stopSockets();

          this.cdr.detectChanges();
        }
      });
  }


  onSearch(value: string) {
    this.searchTerm = value.toLowerCase();

    this.filteredIdeas = this.ideas.filter(idea =>
      idea.title.toLowerCase().includes(this.searchTerm) ||
      idea.description.toLowerCase().includes(this.searchTerm)
    );
  }

  private replaceIdea(updated: Idea) {
    const replace = (list: Idea[]) => {
      const index = list.findIndex(i => i.id === updated.id);
      if (index !== -1) list[index] = updated;
    };

    replace(this.ideas);

    if (this.searchTerm) {
      this.filteredIdeas = this.ideas.filter(idea =>
        idea.title.toLowerCase().includes(this.searchTerm) ||
        idea.description.toLowerCase().includes(this.searchTerm)
      );
    } else {
      
      this.filteredIdeas = [...this.ideas];
    }

    this.filteredIdeas.sort((a, b) => b.vote_count - a.vote_count);

    this.cdr.detectChanges();
  }

  isVoting(id: string): boolean {
    return this.processingVotes.has(id);
  }

  upvote(id: string) {
    if (this.isVoting(id)) return;

    this.votingErrors.delete(id);
    this.processingVotes.add(id);

    this.ideasService.upvote(id).pipe(
      finalize(() => {
        this.processingVotes.delete(id);
        this.cdr.detectChanges(); 
      })
    ).subscribe({
      next: (updatedIdea) => this.replaceIdea(updatedIdea),
      error: () => {
        this.votingErrors.set(id, 'Failed to upvote');
        this.cdr.detectChanges();
        
        setTimeout(() => {
          this.votingErrors.delete(id);
          this.cdr.detectChanges();
        }, 3000);
      }
    });
  }

  downvote(id: string) {
    if (this.isVoting(id)) return;

    this.votingErrors.delete(id);
    this.processingVotes.add(id);

    this.ideasService.downvote(id).pipe(
      finalize(() => {
        this.processingVotes.delete(id);
        this.cdr.detectChanges(); 
      })
    ).subscribe({
      next: (updatedIdea) => this.replaceIdea(updatedIdea), 
      error: () => {
        this.votingErrors.set(id, 'Failed to downvote');
        this.cdr.detectChanges();

        setTimeout(() => {
          this.votingErrors.delete(id);
          this.cdr.detectChanges();
        }, 3000);
      }
    });
  }
  getVoteColor(votes: number): string {
    if (votes > 20) return 'text-emerald-600';
    if (votes > 10) return 'text-blue-600';
    if (votes > 0) return 'text-gray-800';
    if (votes < 0) return 'text-rose-600';
    return 'text-gray-500';
  }

  getTrendingColor(index: number): string {
    if (index === 0) return 'from-amber-500 to-orange-500 shadow-lg shadow-amber-500/20';
    if (index === 1) return 'from-blue-500 to-indigo-500 shadow-lg shadow-blue-500/20';
    if (index === 2) return 'from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/20';
    return 'from-gray-100 to-gray-200';
  }

  getCardBorderColor(votes: number): string {
    if (votes > 20) return 'border-emerald-200';
    if (votes > 10) return 'border-blue-200';
    if (votes > 0) return 'border-gray-200';
    if (votes < 0) return 'border-rose-200';
    return 'border-gray-200';
  }

  getVoteButtonColor(votes: number, type: 'up' | 'down'): string {
    const base = 'transition-all duration-300 hover:scale-105 active:scale-95 ';
    
    if (type === 'up') {
      if (votes > 20) return base + 'bg-gradient-to-r from-emerald-500 to-green-500 hover:shadow-lg hover:shadow-emerald-500/30';
      if (votes > 10) return base + 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:shadow-lg hover:shadow-blue-500/30';
      return base + 'bg-gradient-to-r from-gray-600 to-gray-700 hover:shadow-lg hover:shadow-gray-500/30';
    } else {
      if (votes < 0) return base + 'bg-gradient-to-r from-rose-500 to-pink-500 hover:shadow-lg hover:shadow-rose-500/30';
      return base + 'bg-gradient-to-r from-gray-600 to-gray-700 hover:shadow-lg hover:shadow-gray-500/30';
    }
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.ideaForm.reset();
  }

  submitIdea() {
    if (this.ideaForm.invalid || this.submitting) return;

    this.submitting = true; 

    const { title, description } = this.ideaForm.value;

    this.ideasService.addIdea({ title: title!, description: description! })
      .pipe(
        finalize(() => {
          this.submitting = false; 
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: () => {
          this.closeModal();
        },
        error: (err) => console.error('Error adding idea:', err)
      });
  }


  get title() {
    return this.ideaForm.get('title');
  }

  get description() {
    return this.ideaForm.get('description');
  }

}